import { stateEmitter } from '../event/eventBus.js';
import EventEmitter from '../event/eventEmitter.js';
import { MissionStateBase } from '../missionStates/missionStateBase.js';
import { AppStateKeys, AppStates } from '../types/missionTypes.js';
/**
 * @typedef {import('src/types/missionTypes.js').AppStateKey} AppStatesKey
 * @typedef {import('../types/missionTypes.js').AppStateValue} AppStateValue
 */

export class FSM {
	/**
	 *
	 * @param {import('src/types/missionTypes.js').GameController} gameController
	 */
	constructor(gameController) {
		this.game = gameController;
		this.states = new Map();
		/**
		 * @type {MissionStateBase}
		 */
		this.currentState = null;
		this.factories = {};

		// Maybe needed, maybe not
		this.controllers = new Map();
		this.views = new Map();
		this.previousTelemetry = null;

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
	transitionTo(key, dev = false) {
		if (dev) {
			if (this.currentState?.requiredActions) {
				[...this.currentState.requiredActions.keys()].forEach(key => {
					this.currentState.markActionComplete(key);
				});
			}
		}
		const previousState = this.currentState;

		// const state = this.states.get(AppStates[key]);
		const stateKeyValue = AppStates[key];

		// Temp class holders
		let stateAttempt;
		let controllerAttempt;
		let viewAttempt;
		// Lazily create the state if not yet constructed
		if (!this.states.has(stateKeyValue)) {
			// State not yet created
			console.log('State not yet created: ', stateKeyValue);

			const entry = this.factories[key];
			// Yes its unnecessary but its here for future implementation
			const { factoryFn, meta } = entry;

			if (!entry || !entry.factoryFn) {
				throw new Error(`No state or factory found for key "${key}"`);
			}

			const { view, controller, state } = entry.factoryFn();

			if (!(state instanceof MissionStateBase)) {
				throw new TypeError(
					`Factory for "${key}" must return a state extending MissionStateBase`
				);
			}

			stateAttempt = state;
			controllerAttempt = controller;
			viewAttempt = view;

			this.states.set(stateKeyValue, stateAttempt);
			this.views.set(stateKeyValue, viewAttempt);
			this.controllers.set(stateKeyValue, controllerAttempt);

			// Else if state already constructed
		} else {
			// If state already constructed, inject previousTelemetry directly
			const /** @type {MissionStateBase} */ state = this.states.get(stateKeyValue);
			stateAttempt = state;
		}

		// Get 'live' phase (not pre_start, paused or failed)
		const excluded = [AppStates.PRE_START, AppStates.PAUSED, AppStates.FAILED];
		console.log('Excluded: ', excluded);

		const livePhaseKeys = Object.entries(AppStates)
			.filter(
				([key, value]) => !excluded.includes(/** @type {AppStateValue} */ (value))
			)
			.map(([key, value]) => key);

		// If a live phase:
		console.log('PhaseKys: ', livePhaseKeys);

		if (livePhaseKeys.includes(/** @type {AppStatesKey} */ (key))) {
			const phase = this.game.timeLine.getPhase(key);
			console.log('phase in fsm: ', phase);

			if (stateAttempt.setPreviousTelemetry && this.previousTelemetry) {
				stateAttempt.setPreviousTelemetry(this.previousTelemetry);
			} else {
				// this.previousTelemetry =
			}
		} else {
			console.log('NOT LIVE PHASE');
		}

		console.log('this.currentState: ', this.currentState);
		if (this.currentState) {
			this.currentState.exit();
		}
		const /** @type {MissionStateBase} */ newState = this.states.get(stateKeyValue);
		this.currentState = newState;
		this.currentState.enter();
		if (dev) {
			return { previousState, newState };
		}
	}
}
