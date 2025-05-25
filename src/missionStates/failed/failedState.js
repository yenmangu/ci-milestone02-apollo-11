import { MissionStateBase } from '../missionStateBase.js';

export class FailedState extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
	}
	enter() {
		console.log('Failed state entered');
	}
	exit() {
		console.log('Exiting Failed state');
	}
	handleInput() {
		console.log('Input in Failed detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
