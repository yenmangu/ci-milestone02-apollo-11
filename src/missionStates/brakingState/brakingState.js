import { MissionStateBase } from '../missionStateBase.js';

export class BrakingPhase extends MissionStateBase {
	constructor(gameController, key) {
		super(gameController, key);
	}
	enter() {
		console.log('BrakingPhase state entered');
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
