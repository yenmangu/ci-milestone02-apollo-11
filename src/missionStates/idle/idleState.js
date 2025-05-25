import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { MissionStateBase } from '../missionStateBase.js';
/**
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 */

/**
 * Represents 'IDLE' mission state
 * @extends MissionStateBase
 */
export class IdleState extends MissionStateBase {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {import('src/types/missionTypes.js').AppStatesKeys} key
	 */
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
	}

	/**
	 * @override
	 * @param {MissionPhase} phase
	 */
	onEnter(phase) {}

	exit() {
		console.log('Exiting idle state');
	}
	handleInput() {
		console.log('Input in IdleState detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
