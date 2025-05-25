import { MissionStateBase } from '../missionStateBase.js';

export class FailedState extends MissionStateBase {
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
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
