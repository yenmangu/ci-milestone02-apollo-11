import { MissionStateBase } from '../missionStateBase.js';

export class DescentOrbit extends MissionStateBase {
	constructor(gameController, key) {
		super(gameController, key);
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
