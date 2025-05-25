import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { MissionStatesKeys } from '../../types/missionTypes.js';
import { MissionStateBase } from '../missionStateBase.js';

export class PreStartState extends MissionStateBase {
	/**
	 *
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {import('../../types/missionTypes.js').AppStatesKeys} key
	 */
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
	}

	enter() {
		console.log('overriding enter');
	}

	exit() {
		console.log('Overridding exit');
	}
	_onUserStarted() {
		this.game.fsm.transitionTo(MissionStatesKeys.idle);
	}
}
