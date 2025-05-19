import { MissionState } from '../missionState.js';

export class Paused extends MissionState {
	constructor(gameController) {
		super(gameController);
	}
	enter() {
		console.log('Paused state entered');
	}
	exit() {
		console.log('Exiting Paused state');
	}
	handleInput() {
		console.log('Input in Paused detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
