/**
 * @typedef {import('../../types/uiTypes.js').PreStartUIElements} UIElements
 * @typedef {import('../../types/uiTypes.js').DSKYElements} DSKYElements
 */

import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { MissionStatesKeys } from '../../types/missionTypes.js';
import { PreStartView } from './preStartView.js';

export class PreStartController {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {PreStartView} view
	 */
	constructor(gameController, dskyInterface, view) {
		this.gameController = gameController;
		this.dsky = dskyInterface;
		this.view = view;

		// Can now attach event listener to view because view extends `EventTarget`
		this.view.addEventListener('userStarted', event => {
			this.onUserStarted(event);
		});
	}
	onUserStarted(event) {
		console.log('Event captured: ', event);
		console.log('Starting simulation...');
		// Check for any state changes
		this.gameController.fsm.transitionTo(MissionStatesKeys.idle);
	}
}
