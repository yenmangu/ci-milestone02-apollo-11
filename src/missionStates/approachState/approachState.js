import { MissionStateBase } from '../missionStateBase.js';

export class ApproachPhase extends MissionStateBase {
	constructor(gameController) {
		super(gameController);
	}
	enter() {
		console.log('ApproachPhase state entered');
	}
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
