import { DisplayController } from './display/displayController.js';

import createKeypadStateManager from './keypad/keypadStateManager.js';
import { DisplayView } from './display/displayView.js';
import { ModeTypes } from '../types/dskyTypes.js';
import { pushButtonEmitter } from '../event/eventBus.js';
import { KeypadController } from './keypad/keypadController.js';

export class DSKYController {
	/**
	 *
	 * @param {import("../types/dskyTypes.js").displayMap} displayMap
	 * @param {Object} uiElements
	 */
	constructor(displayMap, uiElements) {
		/**
		 * @type {import('../types/dskyTypes.js').SevenSegmentDisplay}
		 */
		this.displayController = new DisplayController(displayMap, uiElements);
		this.display = new DisplayView();

		/** @type {KeypadController} */
		this.keypadController = new KeypadController(displayMap, {
			getPolarity: this.getPolarity.bind(this),
			resetDsky: this.resetDsky.bind(this)
		});

		const displayInterface = {
			write: (id, val) => this.displayController.write(id, val),
			bulkWrite: vals => this.displayController.bulkWrite(vals),
			clearVerbNoun: () => this.displayController.clearVerbNoun()
		};

		this.keypad = createKeypadStateManager(displayInterface);

		this.keypadController.onButtonClick(
			this.keypadController.handleInput.bind(this)
		);

		this.devLightsSubscription = undefined;
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
				this.display.setLightViaEvent(event.id);
			}
		});
	}

	initiate() {
		this.display.setDskyStateZero();
	}
}
