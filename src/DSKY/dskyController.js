import { DisplayController } from './display/displayController.js';

import createKeypadStateManager from './keypad/keypadStateManager.js';
import { DisplayRender } from './display/displayRender.js';
import { ModeTypes } from '../types/dskyTypes.js';
import { pushButtonEmitter } from '../event/eventBus.js';
import { KeypadController } from './keypad/keypadController.js';

export class DSKY {
	/**
	 *
	 * @param {import("../types/dskyTypes.js").displayMap} displayMap
	 */
	constructor(displayMap) {
		/**
		 * @type {import('../types/dskyTypes.js').SevenSegmentDisplay}
		 */
		this.displayController = new DisplayController(displayMap);
		this.display = new DisplayRender();

		/** @type {KeypadController} */
		this.keypadController = new KeypadController(displayMap, this);

		const displayInterface = {
			write: (id, val) => this.displayController.write(id, val),
			bulkWrite: vals => this.displayController.bulkWrite(vals),
			clearVerbNoun: () => this.displayController.clearVerbNoun()
		};
		this.keypad = createKeypadStateManager(displayInterface);

		this.keypadController.onButtonClick(
			this.keypadController.handleInput.bind(this)
		);

		this.getDsky();
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
	getDsky() {
		throw new Error('Method not implemented.');
	}
}
