/**
 * @typedef {import("../simulationState.js").SimulationState} SimulationState
 * @typedef {import("../../types/timelineTypes.js").PhaseId} PhaseId
 * @typedef {import("../../types/runtimeTypes.js").RuntimePhase} RuntimePhase
 * @typedef {import("../../types/runtimeTypes.js").RuntimeCue} RuntimeCue
 * @typedef {import('../../types/runtimeTypes.js').NonTimeAction} NonTimeAction
 */

import { compareGET } from '../../util/GET.js';

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
		this.log = simulationState.log;
		this.phaseId = phaseMeta.phaseId;
		/** @type {TickPayload} */ this.lastTickPayload = null;
		// Cues
		/** @type {RuntimeCue[]} */ this.chronologicalCues = [];
	}

	enter() {
		console.log('Phase meta.allCues: ', this.phaseMeta.allCues);
		this.chronologicalCues = [...this.phaseMeta.allCues].sort((a, b) =>
			compareGET(a.get, b.get)
		);

		if (typeof this.onEnter === 'function') {
			this.onEnter();
		}
	}
	onEnter() {
		console.warn('Method not implemented.');
	}

	/**
	 *
	 * @param {TickPayload} tick
	 */
	tick(tick) {
		console.log('Tick invoked');

		if (this.lastTickPayload === null) {
			this.lastTickPayload = tick;
			return;
		}

		this.lastTickPayload = tick;
		if (typeof this.onTick === 'function') {
			this.onTick(tick);
		}
		// Trigger cues whose GET matches current tick

		const currentGET = tick.get;
		for (const cue of this.chronologicalCues) {
			if (cue.getSeconds !== currentGET) {
				continue;
			}
			this.simulationState.playCue(cue);
		}
		for (const cue of Object.values(this.phaseMeta.cuesByKey)) {
			if (cue.requiresAction && cue.failsAfter) {
				/** @type {NonTimeAction} */ const action =
					this.phaseMeta.nonTimeActions[cue.requiresAction];
			}
		}
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
		console.warn('Method not implemented.');
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
