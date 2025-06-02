import { DisplayController } from './display/displayController.js';
import { DSKYController } from './dskyController.js';
import { HudController } from './hud/hudController.js';

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
		this.dskyController = dskyController;
		this.hud = hudController;
	}

	write(id, value) {
		this.dskyController.displayController.write(id, value);
	}

	writeProgram(value) {
		this.dskyController.displayController.write('prog', value);
	}

	bulkWrite(values) {
		this.dskyController.displayController.bulkWrite(values);
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

	showAll() {}
}
