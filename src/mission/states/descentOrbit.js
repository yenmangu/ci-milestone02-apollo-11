import { MissionState } from '../missionState.js';

export class DescentOrbit extends MissionState {
	constructor(gameController) {
		super(gameController);
	}
	enter() {
		console.log('DescentOrbit state entered');
	}
	exit() {
		console.log('Exiting DescentOrbit state');
	}
	handleInput() {
		console.log('Input in DescentOrbit detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
