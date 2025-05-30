import { MissionStateBase } from '../missionStateBase.js';

export class PauseState extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
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
}
