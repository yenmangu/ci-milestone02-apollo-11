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
		buffer: '',
		polarity: null
	};

	const logState = invoker => {
		console.log(invoker, ': Current keypad state: ', { ...state });
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
			logState('setMode');
			pushButtonEmitter.emit({ type: mode, action: 'enable' });
		},
		appendDigit(digit) {
			if (state.mode) {
				state.buffer += digit;
			}
			logState('appendDigit');
			pushButtonEmitter.emit({ type: 'digit', digit: digit });
		},

		setPolarity(polarity) {
			polarity === 'plus' ? (state.polarity = '+') : (state.polarity = '-');
			logState('polarity');
		},

		finalise() {
			console.log('finalising..');
			console.log('State before finalising: ', state);

			if (state.mode === 'verb') {
				state.verb = state.buffer;
				updateDisplay();
			} else if (state.mode === 'noun') {
				state.noun = state.buffer;
				updateDisplay();
			}
			pushButtonEmitter.emit({ type: state.mode, action: 'disable' });
			state.mode = null;
			state.buffer = '';
			logState('finalise');
		},
		reset() {
			console.log('From keypadStateManager: reset selected');

			state.mode = 'clr';
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
};

export default createKeypadStateManager;
