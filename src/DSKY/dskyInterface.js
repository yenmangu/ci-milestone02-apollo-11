import { DisplayController } from './display/displayController.js';
import { DSKYController } from './dskyController.js';
import { HudController } from './hud/hudController.js';
import { indicatorLightsEmitter, stateEmitter } from '../event/eventBus.js';

/**
 * Public façade for all DSKY operations.
 * Wraps the internal `DSKYController` and the internal `HudController` and exposes
 * only high level methods
 */
export class DSKYInterface {
	/**
	 *  @param {DSKYController} dskyController
	 *  @param {HudController} hudController
	 */
	constructor(dskyController, hudController) {
		this._flashingFields = new Set();
		this.dskyController = dskyController;
		this.hud = hudController;
		this.lightsEmitter = indicatorLightsEmitter;
		this.flashInterval = null;
		this.stateEmitter = stateEmitter;
		this.currentKeypadState = null;
		this.stateEmitter.subscribe(state => {
			this.currentKeypadState = state.payload;
			console.log('[dskyInterface]: Keyboard State: ', this.currentKeypadState);
		});
		this.isFlashing = false;
	}

	write(id, value) {
		if (this._flashingFields.has(id)) {
			return;
		}
		this.dskyController.displayController.write(id, value);
	}

	setRegister(registerId, value) {
		this.write(`register_${registerId}`, value);
	}

	writeProgram(value) {
		this.dskyController.displayController.write('prog', value);
	}

	/**
	 *
	 * @param {'verb' | 'noun'} displayField
	 * @param {string} value
	 * @param {number} interval
	 */
	flash(displayField, value, interval = 200) {
		if (this._flashingFields.has(displayField)) {
			return;
		}
		this._flashingFields.add(displayField);
		if (this.flashInterval) {
			clearInterval(this.flashInterval);
		}
		let isVisible = false;
		this.flashInterval = setInterval(() => {
			if (isVisible) {
				this.write(displayField, '');
			} else {
				this.write(displayField, value);
			}
			isVisible = !isVisible;
		}, interval);
		this.isFlashing = true;
	}

	stopFlash() {
		if (this.flashInterval) {
			clearInterval(this.flashInterval);
			this.flashInterval = null;
		}

		this._flashingFields.clear();
		this.isFlashing = false;
	}

	/**
	 *
	 * @param {Record<string,string>} values
	 */
	bulkWrite(values) {
		for (const [field, value] of Object.entries(values)) {
			if (!this._flashingFields.has(field)) {
				this.write(field, value);
			}
		}
		// this.dskyController.displayController.bulkWrite(values);
	}

	resetDisplay() {
		this.dskyController.displayController.setDskyStateZero();
	}

	initiate() {
		this.resetDisplay();
	}

	hideAll() {
		// this.
	}

	unlock() {
		this.dskyController.unlockKeypad(false);
	}

	lock() {
		this.dskyController.unlockKeypad(true);
	}

	showAll() {}

	flashLight(lightId, interval = undefined) {
		this.lightsEmitter.emit('light', {
			id: lightId,
			flash: true,
			interval: interval
		});
	}

	lightOn(lightId, flash = false, interval = undefined) {
		const payload = {
			id: lightId,
			flash: flash,
			interval: interval
		};
		this.lightsEmitter.emit('on', payload);
	}

	lightOff(lightId) {
		this.lightsEmitter.emit('off', { id: lightId });
	}

	compActy(flash = true) {
		this.dskyController.flashProgLight(flash);
	}
}
