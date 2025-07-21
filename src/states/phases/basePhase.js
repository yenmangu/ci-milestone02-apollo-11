/**
 * @typedef {import("../simulationState.js").SimulationState} SimulationState
 * @typedef {import("../../types/timelineTypes.js").PhaseId} PhaseId
 * @typedef {import("../../types/runtimeTypes.js").RuntimePhase} RuntimePhase
 * @typedef {import("../../types/runtimeTypes.js").RuntimeCue} RuntimeCue
 * @typedef {import('../../types/runtimeTypes.js').NonTimeAction} NonTimeAction
 * @typedef {import('../../types/uiTypes.js').UIState} UIState
 * @typedef {import('../simulationState.js').UIController} UIController
 * @typedef {import('../../ui/DSKY/dskyController.js').DskyController} DSKY
 */

import { compareGET, secondsFromGet } from '../../util/GET.js';
import { watchUntilComplete } from '../../util/watchUntilComplete.js';

/**
 * @typedef {import("../../types/clockTypes.js").TickPayload} TickPayload
 */

export class BasePhase {
	/**
	 *
	 * @param {SimulationState} simulationState
	 * @param {RuntimePhase} phaseMeta
	 */
	constructor(simulationState, phaseMeta) {
		this.simulationState = simulationState;
		/** @type {RuntimePhase} */ this.phaseMeta = phaseMeta;
		this.log =
			typeof simulationState.log === 'function'
				? simulationState.log
				: (msg, data) =>
						console.log(
							`[${this.phaseId}] ${msg}`,
							data ? data : 'No data supplied'
						);
		this.phaseId = phaseMeta.phaseId;
		/** @type {TickPayload} */ this.lastTickPayload = null;
		/** @type {number} */ this.currentGETSeconds;
		/** @type {number} */ this.previousGETSeconds;
		// Cues
		/** @type {RuntimeCue[]} */ this.chronologicalCues = [];
		/** @type {RuntimeCue[]} */ this.actionCues = [];
		/** @type {RuntimeCue[]} */ this.expiringCues = [];
		/** @type {NonTimeAction[]} */ this.nonTimeActions = [];
		/** @type {UIState} */ this.uiState;
		/** @type {UIController} */ this.uiController = this.simulationState?.getUI();
		if (this.uiController) {
			/** @type {DSKY} */ this.dskyController = this.uiController.dsky;
		}
		this.actionWatcher = null;
	}

	enter() {
		// console.log('Phase meta.allCues: ', this.phaseMeta.allCues);
		this.chronologicalCues = [...this.phaseMeta.allCues].sort((a, b) =>
			compareGET(a.get, b.get)
		);

		this.actionCues = this.getActionBoundCues();
		this.expiringCues = this.getExpiringCues();
		this.nonTimeActions = this.getNonTimeActions();
		// console.log('actionCues: ', this.actionCues);

		this.setUiData();

		if (typeof this.onEnter === 'function') {
			this.onEnter();
		}
	}

	/**
	 *
	 * @param {UIState} [data]
	 */
	setUiData(data = {}) {
		this.uiController.updateDescription(this.phaseMeta.description);

		if (!this.simulationState.showTelemetry) {
			return;
		}
		const fromTick = data ?? {};

		const { velocity, vUnits, altitude, fuel } = this.phaseMeta?.initialState ?? {};

		/** @type {UIState} */ const uiState = {
			altitude: fromTick.altitude ?? altitude,
			velocity: fromTick.velocity ?? velocity,
			vUnits: fromTick.vUnits ?? vUnits,
			fuel: fromTick.fuel ?? fuel,
			transcript: fromTick.transcript,
			prompt: fromTick.prompt,
			getStamp: fromTick.getStamp ?? this.phaseMeta?.startGET,
			phaseName: fromTick.phaseName ?? this.phaseMeta?.phaseName
		};
		this.uiState = uiState;
		this.uiController.updateHUD(uiState);
		this.uiController.clearHudTranscript();
	}

	getNonTimeActions() {
		return this.phaseMeta.nonTimeActions;
	}
	/**
	 * @returns {RuntimeCue[]}
	 */
	getExpiringCues() {
		return this.actionCues.filter(
			cue => this.getActionByKey(cue.requiresAction)?.failsAfter
		);
	}
	/**
	 *
	 * @param {string} requiresAction
	 * @returns {NonTimeAction}
	 */
	getActionByKey(requiresAction) {
		return this.nonTimeActions.find(action => action.action === requiresAction);
	}

	getActionBoundCues() {
		return this.chronologicalCues.filter(cue => cue.requiresAction);
	}

	onEnter() {
		// console.warn('Method not implemented.');
	}

	/**
	 * @protected
	 */
	watchUntilComplete(onAction, onCue, onComplete) {
		this.actionWatcher = watchUntilComplete(onAction, onCue, onComplete);
	}

	/**
	 *
	 * @param {TickPayload} tickPayload
	 */
	tick(tickPayload) {
		// console.log('triggering debugger at GET:', tickPayload.getString);
		// debugger;

		if (this.lastTickPayload === null) {
			this.lastTickPayload = tickPayload;
			this.previousGETSeconds = tickPayload.getSeconds;
			return;
		}

		this.lastTickPayload = tickPayload;
		this.currentGETSeconds = tickPayload.getSeconds;

		const prev = this.previousGETSeconds;
		const current = this.currentGETSeconds;

		this.previousGETSeconds = current;

		// Trigger cues whose GET matches current tick
		for (const cue of this.chronologicalCues) {
			const time = cue.getSeconds;
			if (
				time > prev &&
				time <= current &&
				!this.simulationState.hasCueBeenPlayed(cue.key)
			) {
				this.simulationState.playCue(cue);
			}
		}

		// Determine if telemetry should be displayed
		if (this.simulationState?.showTelemetry) {
			this.uiController.updateHUD(this.uiState);

			// Update Mission Clock
			this.uiController.hud.updateMissionClock(tickPayload.getString);
		}

		// Safely access the subclass methods
		if (typeof this.onTick === 'function') {
			this.onTick(tickPayload);
		}
		// Check any fails after conditions
		this.checkFailsAfter();
	}

	checkFailsAfter() {
		for (const cue of Object.values(this.phaseMeta.cuesByKey)) {
			if (!cue?.requiresAction) continue;

			/** @type {NonTimeAction | undefined} */ const action =
				this.phaseMeta.nonTimeActions.find(a => a.action === cue.requiresAction);
			if (!action?.failsAfter) continue;

			// console.log('[CHECK] evaluating failsAfter timeout logic');
			// console.log('[CHECK] currentGETSeconds:', this.currentGETSeconds);
			// console.log('[CHECK] failsAfterSeconds:', action.failsAfter.get);

			if (this.hasActionTimedOut(action.failsAfter.get)) {
				this.triggerCueFailure(cue, action);
			}
		}
	}

	/**
	 *
	 * @param {RuntimeCue} cue
	 * @param {NonTimeAction} action
	 */
	triggerCueFailure(cue, action) {
		// console.warn('Method not implemented.');
	}
	/**
	 *
	 * @param {number} failsAfterSeconds
	 * @returns {boolean}
	 */
	hasActionTimedOut(failsAfterSeconds) {
		// console.log('[DEBUG BasePhase] hasActionTimedOut invoked');

		if (this.currentGETSeconds >= failsAfterSeconds) {
			return true;
		}
	}

	hasCueTimedOut(cue) {}

	getCurrentGETSeconds() {
		return this.currentGETSeconds ?? 0;
	}

	/**
	 * Checks if action is required for current cue.
	 * @param {string} cueKey
	 * @returns {boolean}
	 */
	isActionRequiredForCue(cueKey) {
		const cue = this.phaseMeta.cuesByKey[cueKey];
		if (!cue || !cue.requiresAction) return false;
		return !this.simulationState.hasActionBeenCompleted(cue.requiresAction);
	}

	/**
	 * Mark a required cue action as completed.
	 * @param {string} actionKey
	 */
	completeRequiredAction(actionKey) {
		this.simulationState.completeAction(actionKey);
	}

	/**
	 *
	 * @param {TickPayload} tick
	 */
	onTick(tick) {
		// console.warn('Method not implemented.');
	}

	setFastForwardTarget(targetGet) {
		this.uiController.targetGet = targetGet;
	}

	exit() {
		if (typeof this.onExit === 'function') {
			this.onExit();
		}
	}

	onExit() {
		console.warn('Method not implemented.');
	}
}
