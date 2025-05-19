import { renderPhaseInfo } from '../../view/phaseRender.js';
import { MissionState } from '../missionState.js';
/**
 * Represents 'IDLE' mission state
 * @extends MissionState
 */

export class IdleState extends MissionState {
	/**
	 * @typedef {import('src/types/missionTypes.js').GameController} GameController
	 * @typedef {import('src/state/fsm.js').AppStatesKey} StateKey
	 * @param {GameController} gameController
	 * @param {StateKey} stateKey
	 */
	constructor(gameController, stateKey) {
		super(gameController, stateKey);
		/** @type {StateKey} */ this.stateKey = 'IDLE';
	}

	enter() {
		console.log('Idle state entered');
		const phase = this.game.timeLine.getPhase(this.stateKey);
		renderPhaseInfo(phase);
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
