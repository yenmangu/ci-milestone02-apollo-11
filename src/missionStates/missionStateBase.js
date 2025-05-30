/**
 * @template {string} T
 * @typedef {{type: T, [key: string]: any}} EventType
 */

/**
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 * @typedef {import('src/types/missionTypes.js').AppStateKey} StateKey
 */

import { DSKYInterface } from '../DSKY/dskyInterface.js';
import { tickEmitter, stateEmitter, phaseNameEmitter } from '../event/eventBus.js';
import EventEmitter from '../event/eventEmitter.js';
import { GameController } from '../game/gameController.js';
import { actionKeyFor } from '../util/actionKey.js';
import watchUntilComplete from '../util/watchUntilComplete.js';

/**
 * Creates the MissionStateBase class,
 * which has the Game Controller, DSKY Interface
 * and the state key in the contructor.
 *
 * Every state class extends this super,
 * which gives every state sub class access to this instance
 * of the Game Controller and DSKY Interface.
 * @class
 */
export class MissionStateBase {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {StateKey} stateKey
	 */
	constructor(gameController, dskyInterface, stateKey, previousTelemetry) {
		/** @type {GameController} */ this.game = gameController;
		/** @type {DSKYInterface} */ this.dskyInterface = dskyInterface;
		/** @type {StateKey} */ this.stateKey = stateKey;
		/** @type {MissionPhase} */ this.currentPhase = null;
		/** @type {EventEmitter} */ this.stateEmitter = stateEmitter;
		/** @type {EventEmitter} */ this.phaseNameEmitter = phaseNameEmitter;
		/** @type {Object[]} */ this.dskyActions = [];
		/** @type {Set<string>} */ this.requiredActions = new Set();
		/** @type {Set<string>} */ this.actionsCompleted = new Set();
		this.timelineCues = {};
		this.actionWatcher = null;
		this.phaseHeadingEl = document.getElementById('phaseName');

		this.tickEmitter = tickEmitter;
		this.lastTick = null;
		this.tickHandler = null;
		/**
		 * Single point of truth for pause status.
		 * All child state classes inherit this.
		 * @type {boolean}
		 */
		this.isPaused = false;

		/**
		 * Optional hook method that can be implemented in subclasses.
		 * Called when all actions are completed
		 * @type {(() => void | undefined)}
		 */
		this.onAllCompleted = undefined;
		this.previousTelemetry = null;
		/** @type {string[]} */ this.actionKeys = [];
		this.actionMetaData = {};
	}

	setPreviousTelemetry(telemetry) {
		this.previousTelemetry = telemetry;
	}

	getTelemetrySnapshot() {
		return this.telemetry;
	}

	bindTickHandler() {
		/**
		 *
		 * @param {import('../types/clockTypes.js').TickPayload} tick
		 * @returns
		 */
		this.tickHandler = tick => {
			if (this.isPaused) {
				return;
			}

			const currentGet = typeof tick === 'object' && tick?.get;
			if (currentGet == null) {
				return;
			}

			// First tick
			if (this.lastTick === null) {
				this.lastTick = currentGet;
				return;
			}

			const deltaTime = currentGet - this.lastTick;
			this.lastTick = currentGet;

			this.onTickUpdate(deltaTime, tick.getFormatted);
		};
		this.tickEmitter.on('tick', this.tickHandler);
	}

	onTickUpdate(deltaTime, getFormatted) {
		console.warn('Subclass does not implement onTickUpdate()');
	}

	unsubscribeFromTicks() {
		if (this.tickHandler) {
			this.tickEmitter.off('tick', this.tickHandler);
			this.tickHandler = null;
		}
	}
	// Abstract Methods all child classes must implement

	/**
	 * Called by FSM when state becomes active.
	 * Fetches the JSON phase and delegates to onEnter.
	 */
	enter() {
		if (!this.game.timeLine?.getPhase) {
			console.warn(
				`Skipping enter logic: getPhase not available for state ${this.stateKey}`
			);
		}
		if (!this.stateKey) {
			console.debug('No State Key');
		}
		const phase = this.game.timeLine.getPhase(this.stateKey);

		if (!phase) {
			console.log('Non Mission Critical state found');
		} else {
			this.currentPhase = phase;
			this.updatePhaseHeading(phase.phase_name);
			this.onMissionCritical(phase);
		}
		this.onEnter(phase);
	}

	updatePhaseHeading(phaseName) {
		console.log('PhaseName: ', phaseName);
		this.phaseNameEmitter.emit('phaseName', phaseName);

		if (this.phaseHeadingEl) {
			this.phaseHeadingEl.innerText = phaseName;
		}
	}

	/**
	 *
	 * @param {MissionPhase} phase
	 */
	onMissionCritical(phase) {
		const {
			start_time,
			phase_name,
			description,
			lunar_altitude,
			altitude_units,
			velocity_fps,
			fuel_percent,
			required_action,
			audio_ref,
			dsky_actions,
			state
		} = phase;

		const telemetry = {
			start_time,
			lunar_altitude,
			altitude_units,
			velocity_fps,
			fuel_percent,
			phase_name
		};

		// this.dskyInterface.hud.updateHud(telemetry);
		this.telemetry = { ...telemetry, state };

		this.dskyInterface.dskyController.expectedActions = dsky_actions;
		this.dskyInterface.dskyController.requiredActions = required_action;
		this.dskyInterface.dskyController.phaseName = phase_name;
		this.dskyInterface.dskyController.phaseDescription = description;
		this.dskyInterface.dskyController.startTime = start_time;
		this.dskyInterface.dskyController.audioRef = audio_ref;
		if (phase.failure_state) {
			this.dskyInterface.dskyController.failureState = phase.failure_state;
		}

		if (required_action) {
			console.log('required action found: ', required_action);
			this.requiredActions.add(required_action);
		}
		if (dsky_actions) {
			this.actionMetaData = dsky_actions;
			for (const action of dsky_actions) {
				if (action.program) {
					this.requiredActions.add(action.program);
				}
				if (Array.isArray(action.verb_noun)) {
					for (const pair of action.verb_noun) {
						const key = actionKeyFor(pair.verb, pair.noun);
						this.requiredActions.add(key);
					}
				}
			}
		}

		console.log('requiredActions in super: ', this.requiredActions);
		console.log('dskyActions in super: ', this.dskyActions);
	}

	/**
	 *
	 * @param {MissionPhase} phase
	 * 	JSON data for this phase or undefined if missing.
	 */
	onEnter(phase) {
		throw new Error('Subclass must implement onEnter()');
	}

	/**
	 *
	 * @protected
	 */
	watchUntilComplete(onAction, onComplete) {
		this.actionWatcher = watchUntilComplete(onAction, onComplete);
	}

	/**
	 *
	 * @param {string} actionKey
	 */
	markActionComplete(actionKey) {
		this.actionsCompleted.add(actionKey);
		const allComplete = [...this.requiredActions].every(action =>
			this.actionsCompleted.has(action)
		);

		if (allComplete) {
			// Ignored because this is an optional hook the subclass can implement
			this.onAllCompleted?.();
			this.stateEmitter.emit('actions', 'complete');
		}
	}

	onExit() {
		console.warn('SubClass does not implement onExit()');
	}

	exit() {
		this.actionWatcher?.unsubscribe();
		this.unsubscribeFromTicks();
		if (typeof this.onExit === 'function') {
			this.onExit();
		}
	}
}
