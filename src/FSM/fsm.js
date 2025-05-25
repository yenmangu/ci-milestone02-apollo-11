import { MissionStateBase } from '../missionStates/missionStateBase.js';
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
	 * @param {MissionStateBase} stateInstance
	 * 	- Ready to go state instance
	 * @example
	 * fsm.addState("DESCENT", PoweredDescentState);
	 * 	// Now accessible via transitionTo("DESCENT")
	 */
	addState(key, stateInstance) {
		// Enforce valid state keys
		if (!(key in AppStates)) {
			throw new TypeError(
				`"${key}" is not a valid state key. Use ${Object.keys(AppStates).join(
					', '
				)}`
			);
		}
		// Runtime validation for class
		if (!(stateInstance instanceof MissionStateBase)) {
			throw new TypeError(`${stateInstance} must inherit from MissionStateBase`);
		}
		this.states.set(AppStates[key], stateInstance);
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
