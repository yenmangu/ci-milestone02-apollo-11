import { MissionStateBase } from '../missionStateBase.js';

export class FinalDescent extends MissionStateBase {
	constructor(gameController, key) {
		super(gameController, key);
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
