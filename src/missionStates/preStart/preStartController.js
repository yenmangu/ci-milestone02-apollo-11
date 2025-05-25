/**
 * @typedef {import('../../types/uiTypes.js').PreStartUIElements} UIElements
 * @typedef {import('../../types/uiTypes.js').DSKYElements} DSKYElements
 */

import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { devNavEmitter } from '../../event/eventBus.js';
import { GameController } from '../../game/gameController.js';
import { AppStateKeys } from '../../types/missionTypes.js';
import { PreStartView } from './preStartView.js';

export class PreStartController {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {PreStartView} view
	 */
	constructor(gameController, dskyInterface, view) {
		// console.trace('preStartController: ', this);
		this.gameController = gameController;
		this.dsky = dskyInterface;
		this.view = view;

		this.onUserStarted = this.onUserStarted.bind(this);
		// Can now attach event listener to view because view extends `EventTarget`
		['userStarted', 'reset'].forEach(eventName => {
			this.view.addEventListener(eventName, this.handleEvent.bind(this));
		});
	}

	handleEvent(event) {
		if (event.type) {
			if (event.type === 'userStarted') {
				this.onUserStarted();
			}
			if (event.type === 'reset') {
				this.resetSimulation();
			}
		}
	}

	handleNavigation(type) {}
	resetSimulation() {
		this.view.onReset();
		this.gameController.fsm.transitionTo(AppStateKeys.pre_start);
	}

	onUserStarted() {
		this.view.onStart();
		// console.log('this.gameController: ', this.gameController);
		// console.log('this.gameController.fsm: ', this.gameController?.fsm);

		// console.log('Event captured: ', event);
		// console.log('Starting simulation with key: ', MissionStatesKeys.idle);
		// Check for any state changes
		this.gameController.fsm.transitionTo(AppStateKeys.idle);
	}
}
