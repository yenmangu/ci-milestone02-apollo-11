import { MissionStateBase } from '../missionStateBase.js';

export class Alarm1202 extends MissionStateBase {
	constructor(gameController, key) {
		super(gameController, key);
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
