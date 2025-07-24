/**
 * @typedef {import('../../types/keypadTypes.js').KeypadState} KeypadState
 * @typedef {import('../../types/keypadTypes.js').keypadStateManager} keypadStateManager
 * @typedef {import('../../types/keypadTypes.js').DisplayInterface} DisplayInterface
 * @typedef {import('../../types/keypadTypes.js').Mode} Mode
 */

import { pushButtonEmitter } from '../../event/eventBus.js';

/**
 *
 * @param {import('../../types/keypadTypes.js').DisplayInterface} displayInterface
 * @returns {keypadStateManager}
 */
const createKeypadStateManager = displayInterface => {
	// console.log('Creating keyboard state manager: ');

	/**@type {KeypadState} */
	const state = {
		mode: null,
		verb: null,
		noun: null,
		buffer: '',
		polarity: null
	};

	const logState = invoker => {
		console.log(invoker, ': Current keypad state: ', { ...state });
	};

	const manager = {
		isFinalised: false,
		/** @param {Mode} mode  */
		setMode(mode) {
			console.log('Invoked set mode');
			state.mode = mode;
			if (state.mode === 'noun') {
				state.verb = state.buffer;
			}

			state.buffer = '';
			logState('setMode');
			pushButtonEmitter.emit('keypad', { mode: mode, action: 'enable' });
		},

		appendDigit(digit) {
			if (state.mode) {
				state.buffer += digit;
			}
			this.checkOpError();
		},

		setPolarity(polarity) {
			polarity === 'plus' ? (state.polarity = '+') : (state.polarity = '-');
			logState('polarity');
		},

		finalise() {
			if (state.mode === 'verb') {
				state.verb = state.buffer !== '' ? state.buffer : '00';
			} else if (state.mode === 'noun') {
				state.noun = state.buffer !== '' ? state.buffer : '00';
			}
			logState('finalise');
			displayInterface.bulkWrite({
				verb: state.verb ?? '00',
				noun: state.noun ?? '00'
			});
			state.mode = null;
			state.buffer = '';
			pushButtonEmitter.emit('finalise', state);
			this.isFinalised = true;
		},

		keyRel() {
			if (!this.isFinalised) return;
			pushButtonEmitter.emit('key-rel', state);
			this.isFinalised = false;
		},

		reset() {
			console.log('From keypadStateManager: reset selected');

			state.mode = null;
			state.verb = null;
			state.noun = null;
			state.buffer = '';
			state.polarity = null;
			displayInterface.clearVerbNoun();
			pushButtonEmitter.emit('cancel-err', state);
			pushButtonEmitter.emit('keypad', state);
		},

		getState() {
			return { ...state };
		},

		checkOpError() {
			if (state.mode === 'verb' || state.mode === 'noun') {
				if (state.buffer.length > 2) {
					pushButtonEmitter.emit('op-err', state);
				} else {
					pushButtonEmitter.emit('cancel-err', state);
				}
			}
		}
	};
	return manager;
};

export default createKeypadStateManager;
