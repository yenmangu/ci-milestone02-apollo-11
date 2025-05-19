import { renderPhaseInfo } from '../../view/phaseRender.js';
import { MissionState } from '../missionState.js';
/**
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 */

/**
 * Represents 'IDLE' mission state
 * @extends MissionState
 */
export class IdleState extends MissionState {
	/**
	 * @typedef {import('src/types/missionTypes.js').GameController} GameController
	 * @typedef {import('src/FSM/fsm.js').AppStatesKey} StateKey
	 * @param {GameController} gameController
	 * @param {StateKey} stateKey
	 */
	constructor(gameController, stateKey) {
		super(gameController, stateKey);
		/** @type {StateKey} */ this.stateKey = 'IDLE';
	}

	/**
	 * @override
	 * @param {MissionPhase} phase
	 */
	onEnter(phase) {
		console.log('[State: Idle] onEnter');
		if (phase) {
			renderPhaseInfo(phase);
		}
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
