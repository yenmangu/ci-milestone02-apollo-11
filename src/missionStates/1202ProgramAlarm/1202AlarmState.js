import { MissionStateBase } from '../missionStateBase.js';

export class Alarm1202State extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
	}
	onEnter() {}
	exit() {
		console.log('Exiting Alarm1202 state');
	}
	handleInput() {
		console.log('Input in Alarm1202 detected');
	}
}
