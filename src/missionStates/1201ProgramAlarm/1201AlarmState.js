import { MissionStateBase } from '../missionStateBase.js';

export class Alarm1201State extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
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
