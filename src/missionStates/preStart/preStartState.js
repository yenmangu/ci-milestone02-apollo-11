import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { AppStateKeys } from '../../types/missionTypes.js';
import { MissionStateBase } from '../missionStateBase.js';
import { PreStartController } from './preStartController.js';

export class PreStartState extends MissionStateBase {
	/**
	 *
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {PreStartController} stateController
	 * @param {import('../../types/missionTypes.js').AppStateKey} key
	 */
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
	}

	onEnter() {
		this.stateController.resetSimulation();
	}

	exit() {
		console.log('Overridding exit');
		this.stateController.onExit();
	}
	_onUserStarted() {
		this.game.fsm.transitionTo(AppStateKeys.idle);
	}
}
