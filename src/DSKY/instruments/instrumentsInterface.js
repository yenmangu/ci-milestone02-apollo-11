import { InstrumentsController } from './instrumentController.js';

export class InstrumentsInterface {
	/**
	 *
	 * @param {InstrumentsController} instrumentsController
	 */
	constructor(instrumentsController) {
		this.controller = instrumentsController;
	}
}
