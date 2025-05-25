import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { MissionStateBase } from '../missionStateBase.js';
import { DescentOrbitController } from './descentOrbitController.js';

export class DescentOrbitState extends MissionStateBase {
	/**
	 *
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {DescentOrbitController} stateController
	 * @param {import('../../types/missionTypes.js').AppStateKey} key
	 */
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.controller = stateController;
	}

	onEnter() {}

	exit() {
		console.log('Exiting DescentOrbit state');
	}
	handleInput() {
		console.log('Input in DescentOrbit detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
