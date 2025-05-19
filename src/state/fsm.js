import { MissionState } from '../mission/missionState.js';
import { AppStates } from '../types/missionTypes.js';
/**
 * @typedef {import('src/types/missionTypes.js').AppStatesKeys} AppStatesKey
 */

export class FSM {
	/**
	 *
	 * @param {import('src/types/missionTypes.js').GameController} gameController
	 */
	constructor(gameController) {
		this.game = gameController;
		this.states = new Map();
		// /**
		//  * @type {}
		//  */
		this.currentState = null;
	}
	/**
	 * Adds a new mission state to the finite state machine.
	 *
	 * @param {AppStatesKey} key
	 * 	- The key used to identify this state (e.g, "DESCENT").
	 * Must be key from States enum.
	 * @param {import('src/types/missionTypes.js').MissionStateContructor} stateClass
	 * 	- A class constructor for the mission state.
	 * @example
	 * fsm.addState("DESCENT", PoweredDescentState);
	 * 	// Now accessible via transitionTo("DESCENT")
	 */
	addState(key, stateClass) {
		// Enforce valid state keys
		if (!(key in AppStates)) {
			throw new TypeError(
				`"${key}" is not a valid state key. Use ${Object.keys(AppStates).join(
					', '
				)}`
			);
		}
		// Runtime validation for class
		if (!(stateClass.prototype instanceof MissionState)) {
			throw new TypeError(`${stateClass.name} must inherit from MissionState`);
		}
		const instance = new stateClass(this.game, key);
		this.states.set(AppStates[key], instance);
	}
	/**
	 *
	 * @param {AppStatesKey} key
	 */
	transitionTo(key) {
		const state = this.states.get(AppStates[key]);
		if (!state) {
			throw new Error(`State "${key}" not found`);
		}
		if (this.currentState) this.currentState.exit();
		this.currentState = state;
		this.currentState.enter();
	}
}
