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
		this.requiredActions = '';
		this.phaseName = '';
		this.phaseDescription = '';
		this.failureState = {};
		this.audioRef = '';

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
		this.keypadSubscription = pushButtonEmitter.subscribe(event => {
			// Keypad events (lights etc)
		});
	}

	initiate() {
		this.displayController.setDskyStateZero();
	}
}
