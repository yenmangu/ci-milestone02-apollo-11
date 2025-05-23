import { DisplayController } from './display/displayController.js';

import createKeypadStateManager from './keypad/keypadStateManager.js';
import { DisplayView } from './display/displayView.js';
import { ModeTypes } from '../types/dskyTypes.js';
import { pushButtonEmitter } from '../event/eventBus.js';
import { KeypadController } from './keypad/keypadController.js';

export class DSKYController {
	/**
	 * @param {import('../types/uiTypes.js').DskyDomElements} uiElements
	 */
	constructor(uiElements) {
		console.log(uiElements);
		this.displayMap = uiElements.displayMap;
		this.lightsMap = uiElements.indicatorLights;
		if (!this.displayController) {
			/** @type {DisplayController} */
			this.displayController = new DisplayController(this.displayMap, uiElements);
		}

		/** @type {KeypadController} */
		this.keypadController = new KeypadController(this.displayMap, {
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

	initiate() {
		this.displayController.setDskyStateZero();
	}
}
