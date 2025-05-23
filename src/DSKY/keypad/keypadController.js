import { ModeTypes } from '../../types/dskyTypes.js';
import { DSKYController } from '../dskyController.js';
import createKeypadStateManager from './keypadStateManager.js';

export class KeypadController {
	/**
	 *
	 * @param {*} displayMap
	 * @param {import('../../types/dskyTypes.js').DSKYParentInterface} parent
	 */
	constructor(displayMap, parent) {
		this.parent = parent;
		this.displayMap = displayMap;
		/**
		 * @type {import('../../types/dskyTypes.js').keypadStateManager}
		 */
		this.keypadStateManager = createKeypadStateManager(displayMap);
		/** @type {HTMLButtonElement[]} */
		this.buttons = Array.from(document.querySelectorAll('push-button'));
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
				console.log('Button clicked: ', e.currentTarget);
				handler(btn.dataset.dsky);
			});
		});
	}

	handleInput(dskyData) {
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
