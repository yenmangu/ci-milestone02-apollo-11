import { MissionStateBase } from '../missionStateBase.js';

export class PoweredDescentState extends MissionStateBase {
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
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
