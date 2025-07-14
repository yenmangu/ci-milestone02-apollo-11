/**
 * @typedef {import("../simulationState.js").SimulationState} SimulationState
 * @typedef {import("../../types/timelineTypes.js").PhaseId} PhaseId
 * @typedef {import("../../types/runtimeTypes.js").RuntimePhase} RuntimePhase
 * @typedef {import("../../types/runtimeTypes.js").RuntimeCue} RuntimeCue
 * @typedef {import('../../types/runtimeTypes.js').NonTimeAction} NonTimeAction
 * @typedef {import('../../types/uiTypes.js').UIState} UIState
 */

import { compareGET, secondsFromGet } from '../../util/GET.js';

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
		// Cues
		/** @type {RuntimeCue[]} */ this.chronologicalCues = [];
		/** @type {RuntimeCue[]} */ this.actionCues = [];
		/** @type {RuntimeCue[]} */ this.expiringCues = [];
		/** @type {NonTimeAction[]} */ this.nonTimeActions = [];
		/** @type {UIState} */ this.uiState;
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
		const fromTick = data ?? {};

		const { velocity, vUnits, altitude, fuel } = this.phaseMeta?.initialState ?? {};

		/** @type {UIState} */ const uiState = {
			altitude: fromTick.altitude ?? altitude,
			velocity: fromTick.velocity ?? velocity,
			vUnits: fromTick.vUnits ?? vUnits,
			fuel: fromTick.fuel ?? fuel,
			cueTranscript: fromTick.cueTranscript,
			prompt: fromTick.prompt
		};
		this.simulationState.ui?.updateHUD?.(uiState);
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
	 *
	 * @param {TickPayload} tickPayload
	 */
	tick(tickPayload) {
		// console.log('Tick invoked');

		if (this.lastTickPayload === null) {
			this.lastTickPayload = tickPayload;
			return;
		}

		this.lastTickPayload = tickPayload;
		// console.log('[DEBUG] tickPayload.getSeconds:', tickPayload.getSeconds);
		this.currentGETSeconds = tickPayload.getSeconds;

		// Safely access the subclass methods
		if (typeof this.onTick === 'function') {
			this.onTick(tickPayload);
		}
		// Trigger cues whose GET matches current tick

		for (const cue of this.chronologicalCues) {
			if (cue.getSeconds !== this.currentGETSeconds) {
				continue;
			}
			this.simulationState.playCue(cue);
		}

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

	exit() {
		if (typeof this.onExit === 'function') {
			this.onExit();
		}
	}

	onExit() {
		console.warn('Method not implemented.');
	}
}
