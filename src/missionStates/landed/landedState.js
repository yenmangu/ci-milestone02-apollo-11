import { MissionStateBase } from '../missionStateBase.js';

export class LandedState extends MissionStateBase {
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
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
