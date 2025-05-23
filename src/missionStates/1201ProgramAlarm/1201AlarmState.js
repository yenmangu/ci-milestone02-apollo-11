import { MissionStateBase } from '../missionStateBase.js';

export class Alarm1201 extends MissionStateBase {
	constructor(gameController, key) {
		super(gameController, key);
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
