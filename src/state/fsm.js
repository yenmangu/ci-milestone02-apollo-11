import {} from '../types/dskyTypes.js';
import { MissionState } from 'src/mission/missionState.js';
import { AppStates } from 'src/types/missionTypes.js';

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
		this.currentState = undefined;
	}
	/**
	 * Adds a new mission state to the finite state machine.
	 *
	 * @param {import('src/types/missionTypes.js').AppStatesKeys} name
	 * 	- The key used to identify this state (e.g, "DESCENT").
	 * Must be key from States enum.
	 * @param {import('src/types/missionTypes.js').MissionStateContructor} stateClass
	 * 	- A class constructor for the mission state.
	 * @example
	 * fsm.addState("DESCENT", PoweredDescentState);
	 * 	// Now accessible via transitionTo("DESCENT")
	 */
	addState(name, stateClass) {
		// Enforce valid state keys
		if (!(name in AppStates)) {
			throw new TypeError(
				`"${name}" is not a valid state key. Use ${Object.keys(AppStates).join(
					', '
				)}`
			);
		}
		// Runtime validation for class
		if (!(stateClass.prototype instanceof MissionState)) {
			throw new TypeError(`${stateClass.name} must inherit from MissionState`);
		}
		const stateValue = AppStates[name];
		this.states.set(stateValue, new stateClass(this.game));
	}
	/**
	 *
	 * @param {string} stateName
	 */
	transitionTo(stateName) {
		const state = this.states.get(AppStates[stateName]);
		if (!state) {
			throw new Error(`State "${stateName}" not found`);
		}
		if (this.currentState) this.currentState.exit();
		this.currentState = state;
		this.currentState.enter();
	}
}
