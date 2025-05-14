/**
 * EDIT THIS
 * Exncapsulate the entire DSKY component:
 * 	- seven-segment display
 *  - keypad state management
 *  - push-button wiring
 */

import createKeypadStateManager from 'keypad/keypadStateManager.js';
import { DskyRender } from 'view/dskyRender.js';
import { SevenSegmentDisplay } from 'seven-segment/sevenSegment.js';
import { ModeTypes } from 'util/types.js';

export class DskeyController {
	/**
	 *
	 * @param {import("util/types.js").displayMap} displayMap
	 * @param {HTMLButtonElement[]} buttonElements
	 */
	constructor(displayMap, buttonElements) {
		/**
		 * Create new DSKY Render class
		 * @type {DskyRender}
		 */
		this.view = new DskyRender();

		/**
		 * Create the display writer
		 * @type {SevenSegmentDisplay}
		 */
		this.display = new SevenSegmentDisplay(displayMap);

		/**
		 * Minimal display interface needed for the createKeypadStateManager function
		 * @type {import('util/types.js').DisplayInterface}
		 */
		const displayInterface = {
			write: (id, val) => this.display.write(id, val),
			bulkWrite: vals => this.display.bulkWrite(vals),
			clearVerbNoun: () => this.display.clearVerbNoun()
		};

		/**
		 * Create kepad logic, injecting the minimal needed display interface -
		 * decoupling the SevenSegmentDisplay Class from the factory function
		 * @type {import("util/types.js").KeypadManager}
		 */
		this.keypad = createKeypadStateManager(displayInterface);

		/**
		 * 'Wire' up the buttons
		 */
		this.view.onButtonClick(this.handleInput.bind(this));
	}

	/**
	 * Called on every button click, with the data-dsky string
	 * @param {string} dskyData
	 */
	handleInput(dskyData) {
		if (Object.values(ModeTypes).includes(dskyData)) {
			switch (dskyData) {
				case ModeTypes.VERB:
				case ModeTypes.NOUN:
					this.keypad.setMode(dskyData);
					break;
				case ModeTypes.PLUS:
				case ModeTypes.MINUS:
					this.keypad.setPolarity(this.getPolarity(dskyData));
					break;
				case ModeTypes.CLR:
					this.keypad.reset();
					break;
				case ModeTypes.RSET:
					this.resetDsky();
					break;
				// MORE
				default:
					this.defaultMethod();
			}
		} else {
			this.keypad.appendDigit(dskyData);
		}
	}

	defaultMethod() {
		throw new Error('Method not implemented.');
	}

	resetDsky() {
		throw new Error('Method not implemented.');
	}

	getPolarity(dskyData) {
		return dskyData === 'plus' ? '+' : '-';
	}
}
