import { MissionStateBase } from '../missionStateBase.js';

export class ApproachPhaseState extends MissionStateBase {
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.stateController = stateController;
	}
	onEnter() {}
	exit() {
		console.log('Exiting ApproachPhase state');
	}
	handleInput() {
		console.log('Input in ApproachPhase detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
