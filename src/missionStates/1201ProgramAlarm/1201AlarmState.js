import { MissionStateBase } from '../missionStateBase.js';

export class Alarm1201State extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
	}
	onEnter() {}
	exit() {
		console.log('Exiting Alarm1201 state');
	}
	handleInput() {
		console.log('Input in Alarm1201 detected');
	}
}
