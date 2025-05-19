import { MissionState } from '../missionState.js';

export class PoweredDescent extends MissionState {
	constructor(gameController, key) {
		super(gameController, key);
	}
	enter() {
		console.log('PoweredDescent state entered');
	}
	exit() {
		console.log('Exiting PoweredDescent state');
	}
	handleInput() {
		console.log('Input in PoweredDescent detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
