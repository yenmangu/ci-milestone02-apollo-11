import { MissionState } from '../missionState.js';

export class ApproachPhase extends MissionState {
	constructor(gameController) {
		super(gameController);
	}
	enter() {
		console.log('ApproachPhase state entered');
	}
	exit() {
		console.log('Exiting ApproachPhase state');
	}
	handleInput() {
		console.log('Input in ApproachPhase detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
