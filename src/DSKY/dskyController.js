import { DisplayController } from './display/displayController.js';
import { HudController } from './hud/hudController.js';
import createKeypadStateManager from './keypad/keypadStateManager.js';
import { pushButtonEmitter } from '../event/eventBus.js';
import { KeypadController } from './keypad/keypadController.js';

export class DSKYController {
	/**
	 * @param {import('../types/uiTypes.js').DskyDomElements} uiElements
	 */
	constructor(uiElements) {
		this.uiElements = uiElements;
		this.instruments = uiElements.hudMap;

		this.displayMap = uiElements.displayMap;
		this.lightsMap = uiElements.indicatorLights;
		this.expectedActions = {};
		/** @type {any | any[]} */ this.requiredActions = [];
		this.phaseName = '';
		this.phaseDescription = '';
		this.failureState = {};
		this.audioRef = '';
		/** @type {KeypadController | null} */
		this.keypadController = null;

		if (!this.displayController) {
			/** @type {DisplayController} */
			this.displayController = new DisplayController(this.displayMap, uiElements);
		}

		const displayInterface = {
			write: (id, val) => this.displayController.write(id, val),
			bulkWrite: vals => this.displayController.bulkWrite(vals),
			clearVerbNoun: () => this.displayController.clearVerbNoun()
		};

		// console.log('Creating keypadStateManager...');

		this.keypad = createKeypadStateManager(displayInterface);
		// console.log('Keypad manager created:', this.keypad);

		/** @type {KeypadController} */
		if (!this.keypadController || this.keypadController !== null)
			this.keypadController = new KeypadController(
				{
					getPolarity: this.getPolarity.bind(this),
					resetDsky: this.resetDsky.bind(this)
				},
				this.keypad
			);

		// The handleInput is expecting access to
		// - keypadController.keypadStateManager.
		// This means we must bind to the correct `this` context.
		this.keypadController.onButtonClick(
			this.keypadController.handleInput.bind(this.keypadController)
		);

		this.devLightsSubscription = undefined;
		this.startTime = undefined;
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
		// this.keypadSubscription = pushButtonEmitter.subscribe(event => {
		// 	// Keypad events (lights etc)
		// });
	}

	unlockKeypad(unlock = true) {
		if (unlock) {
			this.keypadController.buttons.forEach(button => {
				button.disabled = true;
			});
		} else {
			this.keypadController.buttons.forEach(button => {
				button.disabled = false;
			});
		}
	}

	initiate() {
		this.displayController.setDskyStateZero();
	}
}
