import { MissionState } from '../missionState.js';

export class Landed extends MissionState {
	constructor(gameController) {
		super(gameController);
	}
	enter() {
		console.log('Landed state entered');
	}
	exit() {
		console.log('Exiting Landed state');
	}
	handleInput() {
		console.log('Input in Landed detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
