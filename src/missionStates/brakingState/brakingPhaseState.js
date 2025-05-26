import { MissionStateBase } from '../missionStateBase.js';

export class BrakingPhaseState extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
	}

	exit() {
		console.log('Exiting BrakingPhase state');
	}
	handleInput() {
		console.log('Input in BrakingPhase detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
