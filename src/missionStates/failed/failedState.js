import { MissionStateBase } from '../missionStateBase.js';

export class Failed extends MissionStateBase {
	constructor(gameController, key) {
		super(gameController, key);
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
