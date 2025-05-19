import { MissionState } from '../missionState.js';

export class BrakingPhase extends MissionState {
	constructor(gameController) {
		super(gameController);
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
