import {} from '../types/dskyTypes.js';
import { GameController } from 'src/controller/gameController.js';
import { MissionState } from 'src/mission/missionState.js';
import { States } from './states.js';

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
	 * @param {keyof import('./states.js').StatesEnum} name
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
		if (!(name in States)) {
			throw new TypeError(
				`"${name}" is not a valid state key. Use ${Object.keys(States).join(', ')}`
			);
		}
		// Runtime validation for class
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
