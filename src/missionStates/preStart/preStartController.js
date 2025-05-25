/**
 * @typedef {import('../../types/uiTypes.js').PreStartUIElements} UIElements
 * @typedef {import('../../types/uiTypes.js').DSKYElements} DSKYElements
 */

import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { PreStartView } from './preStartView.js';

export class PreStartController {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {PreStartView} view
	 */
	constructor(gameController, dskyInterface, view) {
		this.controller = gameController;
		this.dsky = dskyInterface;
		this.view = view;
	}
}
