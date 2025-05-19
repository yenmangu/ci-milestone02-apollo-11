import { MissionState } from '../missionState.js';

export class FinalDescent extends MissionState {
	constructor(gameController) {
		super(gameController);
	}
	enter() {
		console.log('FinalDescent state entered');
	}
	exit() {
		console.log('Exiting FinalDescent state');
	}
	handleInput() {
		console.log('Input in FinalDescent detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
