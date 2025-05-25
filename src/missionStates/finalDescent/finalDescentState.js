import { MissionStateBase } from '../missionStateBase.js';

export class FinalDescentState extends MissionStateBase {
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
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
