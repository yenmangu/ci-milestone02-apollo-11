import { MissionState } from '../missionState.js';

export class IdleState extends MissionState {
	constructor(gameController) {
		super(gameController);
	}
	enter() {
		console.log('Idle state entered');
	}
	exit() {
		console.log('Exiting idle state');
	}
	handleInput() {
		console.log('Input in IdleState detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
