import { pushButtonEmitter } from '../event/eventBus.js';

/**
 *
 * @param {import('../util/types.js').DisplayInterface} display
 * @returns {import('../util/types.js').keypadStateManager}
 */
const createKeypadStateManager = display => {
	console.log('Creating keyboard state manager: ');

	/**@type {import('../util/types.js').KeypadState} */
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
		setMode(mode) {
			state.mode = mode;
			state.buffer = '';
			logState('setMode');
			pushButtonEmitter.emit({ type: mode, action: 'enable' });
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
				state.verb = state.buffer;
			} else if (state.mode === 'noun') {
				state.noun = state.buffer;
			}
			display.bulkWrite({
				verb: state.verb ?? '00',
				noun: state.noun ?? '00'
			});
			state.mode = null;
			state.buffer = '';
		},
		reset() {
			console.log('From keypadStateManager: reset selected');

			state.mode = null;
			state.verb = null;
			state.noun = null;
			state.buffer = '';
			state.polarity = null;
			display.clearVerbNoun();
			pushButtonEmitter.emit({ type: 'reset' });
		},

		getState() {
			return { ...state };
		}
	};
	return manager;
};

export default createKeypadStateManager;
