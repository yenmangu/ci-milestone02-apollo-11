import {} from '../types/dskyTypes.js';
import { GameController } from 'src/controller/gameController.js';
import { MissionState } from 'src/mission/missionState.js';

export class FSM {
	/**
	 *
	 * @param {import('src/types/missionTypes.js').GameController} gameController
	 */
	constructor(gameController) {
		this.game = gameController;
		this.states = new Map();
		/**
		 * @type {}
		 */
		this.currentState = undefined;
	}
	/**
	 * Adds a new mission state to the finite state machine
	 *
	 * @param {string} name - The unique identifier for the state.
	 * @param {import('src/types/missionTypes.js').MissionStateContructor} stateClass - A class constructor for the mission state.
	 */
	addState(name, stateClass) {
		if (!(stateClass.prototype instanceof MissionState)) {
			throw new TypeError(`${stateClass.name} must inherit from MissionState`);
		}
		this.states.set(name, new stateClass(this.game));
	}
	/**
	 *
	 * @param {string} stateName
	 */
	transitionTo(stateName) {
		if (this.currentState) this.currentState.exit();
		this.currentState = this.states.get(stateName);
		this.currentState.enter();
	}
}
