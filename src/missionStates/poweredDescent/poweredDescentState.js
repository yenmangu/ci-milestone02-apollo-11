import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { MissionStateBase } from '../missionStateBase.js';
import { PoweredDescentController } from './poweredDescentController.js';

export class PoweredDescentState extends MissionStateBase {
	/**
	 *
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {PoweredDescentController} stateController
	 * @param {import('../../types/missionTypes.js').AppStateKey} key
	 */
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
	}
	enter() {
		console.log('PoweredDescent state entered');
	}
	exit() {
		console.log('Exiting PoweredDescent state');
	}
	handleInput() {
		console.log('Input in PoweredDescent detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
