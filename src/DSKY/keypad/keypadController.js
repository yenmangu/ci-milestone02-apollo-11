/**
 * @typedef {import('../../types/dskyTypes.js').keypadStateManager} keypadStateManager
 */

import { ModeTypes } from '../../types/dskyTypes.js';

export class KeypadController {
	/**
	 *
	 * @param {import('../../types/dskyTypes.js').DSKYParentInterface} parent
	 * @param {import('../../types/dskyTypes.js').keypadStateManager} keypadStateManager
	 */
	constructor(parent, keypadStateManager) {
		this.parent = parent;
		/**
		 * @type {import('../../types/dskyTypes.js').keypadStateManager}
		 */
		// console.log(
		// 	'Received keypadStateManager in KeypadController:',
		// 	keypadStateManager
		// );

		/** @type {keypadStateManager} */ this.keypadStateManager = keypadStateManager;

		/** @type {HTMLButtonElement[]} */
		this.buttons = Array.from(document.querySelectorAll('button.push-button'));
		// console.log('SANITY BUTTON CHECK', this.buttons);
	}
	/**
	 *
	 * @param {string} dskyData
	 * @param {string} state
	 */
	setButtonState(dskyData, state) {
		const btn = this.buttons.find(b => b.dataset.dskyData === dskyData);
		if (btn) {
			btn.dataset.state = state;
		}
	}

	onButtonClick(handler) {
		this.buttons.forEach(btn => {
			btn.addEventListener('click', e => {
				e.preventDefault();
				const target = /** @type {HTMLButtonElement} */ (e.currentTarget);
				// console.log('Button clicked: ', e.currentTarget);
				handler(target.dataset.dsky);
			});
		});
	}

	handleInput(dskyData) {
		if (!this.keypadStateManager) {
			console.warn('Keypad state manager not initialised');
		}
		if (Object.values(ModeTypes).includes(dskyData)) {
			switch (dskyData) {
				case ModeTypes.VERB:
				case ModeTypes.NOUN:
					this.keypadStateManager.setMode(dskyData);
					break;
				case ModeTypes.ENTR:
					this.keypadStateManager.finalise();
					// this.programController.setProgram()
					break;
				case ModeTypes.PLUS:
				case ModeTypes.MINUS:
					this.keypadStateManager.setPolarity(this.parent.getPolarity(dskyData));
					break;
				case ModeTypes.CLR:
					this.keypadStateManager.reset();
					break;
				case ModeTypes.RSET:
					this.parent.resetDsky();
					break;
				// MORE
				default:
					this.defaultMethod();
			}
		} else {
			this.keypadStateManager.appendDigit(dskyData);
		}
	}
	defaultMethod() {
		throw new Error('Method not implemented.');
	}
}
