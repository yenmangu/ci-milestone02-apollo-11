import { MissionStateBase } from '../missionStateBase.js';

export class LandedState extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
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
}
