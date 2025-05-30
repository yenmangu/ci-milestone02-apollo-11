import { MissionStateBase } from '../missionStateBase.js';

export class BrakingPhaseState extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
	}

	onEnter() {}

	exit() {
		console.log('Exiting BrakingPhase state');
	}
	handleInput() {
		console.log('Input in BrakingPhase detected');
	}
}
