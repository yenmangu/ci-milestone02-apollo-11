import { MissionStateBase } from '../missionStateBase.js';

export class Paused extends MissionStateBase {
	constructor(gameController, key) {
		super(gameController, key);
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
