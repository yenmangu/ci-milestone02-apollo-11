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
		this.dev = false;
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

	// Helper function to determine if state is live state

	isLive(stateKey) {
		const excluded = [AppStates.PRE_START, AppStates.PAUSED, AppStates.FAILED];
		const livePhaseKeys = Object.entries(AppStates)
			.filter(
				([key, value]) => !excluded.includes(/** @type {AppStateValue} */ (value))
			)
			.map(([key, value]) => key);

		if (livePhaseKeys.includes(/** @type {AppStatesKey} */ (stateKey))) {
			return true;
		}
	}

	async devCompleteActions() {
		return new Promise(resolve => {
			if (this.currentState?.requiredActions) {
				[...this.currentState.requiredActions.keys()].forEach(actionKey => {
					this.currentState.markActionComplete(actionKey);
				});
			}
			resolve();
			return;
		});
	}

	/**
	 * Transitions to a state, instantiating lazily if needed
	 * @param {AppStatesKey} key
	 */
	async transitionTo(key) {
		console.trace(`TIMESTAMP: [${performance.now()}]: transitionTo()`);
		return new Promise(async resolve => {
			const newKey = key;
			// if (this.dev) {
			// 	await this.devCompleteActions();
			// }
			const previousState = this.currentState;

			// Dev navigation
			if (previousState && this.dev && previousState._devFastComplete) {
				previousState._devFastComplete = false;
				previousState.exit();
				previousState.timelineCues.forEach(cue => {
					cue.shown = true;
				});
				if (previousState.dskyActions) {
					previousState.dskyActions.program.forEach(p => p.complete === true);
					previousState.dskyActions.verbNoun.forEach(p => p.complete === true);
				}
				previousState.requiredActions.clear();
			} else if (previousState) {
				previousState.exit;
			}

			if (previousState) {
				const prevStateKey = previousState.stateKey;

				if (this.isLive(prevStateKey)) {
					const prevPhase = this.game.timeLine.getPhase(prevStateKey);
					if (!prevPhase) {
						this.previousTelemetry = null;
					}
					const { lunar_altitude, altitude_units, velocity_fps, fuel_percent } =
						prevPhase;

					this.previousTelemetry = {
						lunar_altitude,
						altitude_units,
						velocity_fps,
						fuel_percent
					};
				}
			}

			// const state = this.states.get(AppStates[key]);
			const stateKeyValue = AppStates[newKey];

			// Temp class holders
			let stateAttempt;
			let controllerAttempt;
			let viewAttempt;
			// Lazily create the state if not yet constructed
			if (!this.states.has(stateKeyValue)) {
				// State not yet created
				console.log('State not yet created: ', stateKeyValue);

				const entry = this.factories[newKey];
				// Yes its unnecessary but its here for future implementation
				const { factoryFn, meta } = entry;

				if (!entry || !entry.factoryFn) {
					throw new Error(`No state or factory found for key "${newKey}"`);
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
				const /** @type {MissionStateBase} */ state =
						this.states.get(stateKeyValue);
				stateAttempt = state;
			}

			// Get 'live' phase (not pre_start, paused or failed)

			if (this.isLive(newKey)) {
				if (stateAttempt.setPreviousTelemetry && this.previousTelemetry) {
					stateAttempt.setPreviousTelemetry(this.previousTelemetry);
				} else {
					// this.previousTelemetry =
				}
			} else {
				console.log('NOT LIVE PHASE');
			}

			const /** @type {MissionStateBase} */ newState =
					this.states.get(stateKeyValue);
			this.currentState = newState;
			this.currentState.enter();
			if (this.dev) {
				resolve({ previousState, newState });
				return;
			}
			resolve();
			return;
		});
	}
}
