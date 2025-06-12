import { pushButtonEmitter } from '../../event/eventBus.js';

/**
 *
 * @param {import('../../types/dskyTypes.js').DisplayInterface} displayInterface
 * @returns {import('../../types/dskyTypes.js').keypadStateManager}
 */
const createKeypadStateManager = displayInterface => {
	// console.log('Creating keyboard state manager: ');

	/**@type {import('../../types/dskyTypes.js').KeypadState} */
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
		/** @param {import('../../types/dskyTypes.js').Mode} mode  */
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
		},
		reset() {
			console.log('From keypadStateManager: reset selected');

			state.mode = null;
			state.verb = null;
			state.noun = null;
			state.buffer = '';
			state.polarity = null;
			displayInterface.clearVerbNoun();
			pushButtonEmitter.emit('keypad', state);
		},

		getState() {
			return { ...state };
		}
	};
	return manager;
};

export default createKeypadStateManager;
