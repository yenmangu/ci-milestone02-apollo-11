import { setButtonState } from '../renderUI.js';
import { pushButtonEmitter } from '../event/eventBus.js';

/**
 *
 * @param {import('../util/types.js').SevenSegmentDisplay} display - controller -
 * for writing to the seven segment display
 * @returns {import('../util/types.js').keypadStateManager}
 */
const createKeypadStateManager = display => {
	console.log('Creating keyboard state manager: ');

	/**@type {import('../util/types.js').KeypadState} */
	const state = {
		mode: null,
		verb: null,
		noun: null,
		buffer: ''
	};

	const logState = () => {
		console.log('Current keypad state: ', { ...state });
	};

	const updateDisplay = () => {
		if (state.mode) {
			display.write(state.mode, state.buffer);
		}
	};

	const updateButtonState = activeState => {
		setButtonState;
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
			pushButtonEmitter.emit('inactive');
		},

		finalise() {
			console.log('finalising..');
			console.log('State before finalising: ', state);

			if (state.mode === 'verb') {
				state.verb = state.buffer;
				updateDisplay();
				pushButtonEmitter.emit('verb', { action: 'disable' });
			} else if (state.mode === 'noun') {
				state.noun = state.buffer;
				updateDisplay();
			}
			state.mode = null;
			state.buffer = '';
			logState();
		},
		reset() {
			console.log('From keypadStateManager: reset selected');

			state.mode = null;
			state.verb = null;
			state.noun = null;
			state.buffer = '';
			pushButtonEmitter.emit('reset');
		},
		getState() {
			return { ...state };
		}
	};
};

export default createKeypadStateManager;
