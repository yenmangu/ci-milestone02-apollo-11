import { MissionStateBase } from '../missionStateBase.js';

export class DescentOrbitState extends MissionStateBase {
	constructor(gameController, dskyInterface, key) {
		super(gameController, dskyInterface, key);
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
