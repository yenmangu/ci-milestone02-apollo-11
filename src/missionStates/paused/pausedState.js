import { MissionStateBase } from '../missionStateBase.js';

export class PauseState extends MissionStateBase {
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
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
