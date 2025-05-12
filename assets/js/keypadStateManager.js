/**
 * @typedef {'verb'|'noun'|null} Mode
 */
/**
 * @typedef {Object} KeypadState
 * @property {Mode} mode
 * @property {string|null} verb
 * @property {string|null} noun
 * @property {string} buffer
 */

const createKeypadStateManager = () => {
	console.log('Creating keyboard state manager: ');

	/**@type {KeypadState} */
	const state = {
		mode: null,
		verb: null,
		noun: null,
		buffer: ''
	};

	const logState = () => {
		console.log('Current keypad state: ', { ...state });
	};

	return {
		setMode(mode) {
			state.mode = mode;
			state.buffer = '';
			logState();
		},
		appendDigit(digit) {
			if (state.mode) {
				state.buffer += digit;
			}
			logState();
		},
		finalise() {
			if (state.mode === 'verb') {
				state.verb = state.buffer;
			} else if (state.mode === 'noun') {
				state.noun = state.buffer;
			}
			state.mode = null;
			state.buffer = '';
			logState();
		},
		reset() {
			state.mode = null;
			state.verb = null;
			state.noun = null;
			state.buffer = '';
		},
		getState() {
			return { ...state };
		}
	};
};

export default createKeypadStateManager;
