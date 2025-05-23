import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { MissionStateBase } from '../missionStateBase.js';
import { preStartController } from './preStartController.js';

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
}
