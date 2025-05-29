import { stateEmitter } from '../event/eventBus.js';
import EventEmitter from '../event/eventEmitter.js';
import { MissionStateBase } from '../missionStates/missionStateBase.js';
import { AppStates } from '../types/missionTypes.js';
/**
 * @typedef {import('src/types/missionTypes.js').AppStateKey} AppStatesKey
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
		this.factories = {};

		// Maybe needed, maybe not
		this.controllers = new Map();
		this.views = new Map();

		/** @type {EventEmitter} */ this.stateEmitter = stateEmitter;
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

	// Registers a factory for deffered state creation
	/**
	 *
	 * @param {AppStatesKey} key
	 * @param {()=>{view: any, controller: any, state: MissionStateBase}} factoryFn
	 */
	registerFactory(key, factoryFn, meta = {}) {
		this.factories[key] = { factoryFn, meta };
	}

	/**
	 * Transitions to a state, instantiating lazily if needed
	 * @param {AppStatesKey} key
	 */
	transitionTo(key) {
		console.log('Key: ', key);

		// const state = this.states.get(AppStates[key]);
		const stateKey = AppStates[key];

		// Lazily create the state if not yet constructed

		if (!this.states.has(stateKey)) {
			// console.log('Factories: ', this.factories);

			const { factoryFn: factory, meta } = this.factories[key];
			if (!factory) {
				throw new Error(`No state or factory found for key "${key}"`);
			}

			const { view, controller, state } = factory();
			if (!(state instanceof MissionStateBase)) {
				throw new TypeError(
					`Factory for "${key}" must return a state extending MissionStateBase`
				);
			}

			this.states.set(stateKey, state);
			// Added even if not needed
			this.views.set(stateKey, view);
			this.controllers.set(stateKey, controller);
		}
		if (this.currentState) this.currentState.exit();
		this.currentState = this.states.get(stateKey);
		this.stateEmitter.emit({ type: stateKey });
		this.currentState.enter();
	}
}
