import { MissionStateBase } from '../missionStateBase.js';

export class Alarm1201State extends MissionStateBase {
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
	}
	enter() {
		console.log('Alarm1201 state entered');
	}
	exit() {
		console.log('Exiting Alarm1201 state');
	}
	handleInput() {
		console.log('Input in Alarm1201 detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
