import { MissionStateBase } from '../missionStateBase.js';

export class Alarm1202State extends MissionStateBase {
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
	}
	enter() {
		console.log('Alarm1202 state entered');
	}
	exit() {
		console.log('Exiting Alarm1202 state');
	}
	handleInput() {
		console.log('Input in Alarm1202 detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
