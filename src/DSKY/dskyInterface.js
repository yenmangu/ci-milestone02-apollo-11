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
	 *  @param {HudController} instrumentsController
	 */
	constructor(dskyController, instrumentsController) {
		this.dskyController = dskyController;
		this.instrumentsController = instrumentsController;
	}

	write(id, value) {
		this.dskyController.displayController.write(id, value);
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
