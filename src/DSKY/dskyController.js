/**
 * EDIT THIS
 * Exncapsulate the entire DSKY component:
 * 	- seven-segment display
 *  - keypad state management
 *  - push-button wiring
 */

import createKeypadStateManager from '../keypad/keypadStateManager.js';
import { DskyRender } from './dskyRender.js';
import { SevenSegmentDisplay } from '../seven-segment/sevenSegment.js';
import { ModeTypes } from '../types/dskyTypes.js';
import { devLightsEmitter, pushButtonEmitter } from '../event/eventBus.js';

export class DskeyController {
	/**
	 *
	 * @param {import("src/types/dskyTypes.js").displayMap} displayMap
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
		 * @type {import('src/types/dskyTypes.js').DisplayInterface}
		 */
		const displayInterface = {
			write: (id, val) => this.display.write(id, val),
			bulkWrite: vals => this.display.bulkWrite(vals),
			clearVerbNoun: () => this.display.clearVerbNoun()
		};

		/**
		 * Create kepad logic, injecting the minimal needed display interface -
		 * decoupling the SevenSegmentDisplay Class from the factory function
		 * @type {import("src/types/dskyTypes.js").KeypadManager}
		 */
		this.keypad = createKeypadStateManager(displayInterface);

		/**
		 * 'Wire' up the buttons
		 */
		this.view.onButtonClick(this.handleInput.bind(this));
		this.keypadSubscription = undefined;
		this.devLightsSubscription = devLightsEmitter;
		this.onDevLights();
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
				case ModeTypes.ENTR:
					this.keypad.finalise();
					// this.programController.setProgram()
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

	onStateEvents() {
		this.keypadSubscription = pushButtonEmitter.subscribe(event => {
			// Keypad events (lights etc)
		});
	}

	onDevLights() {
		this.devLightsSubscription.subscribe(event => {
			if (event.type === 'light') {
				console.log('Light event: ', event.id);
				this.view.setLightViaEvent(event.id);
			}
		});
	}

	initiate() {
		this.view.setDskyStateZero();
	}

	onExit() {}
}
