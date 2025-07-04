/**
 * @typedef {import("../simulationState.js").SimulationState} SimulationState
 * @typedef {import("../../types/timelineTypes.js").PhaseId} PhaseId
 * @typedef {import("../../types/runtimeTypes.js").RuntimePhase} RuntimePhase
 * @typedef {import("../../types/runtimeTypes.js").RuntimeCue} RuntimeCue
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
		this.phaseMeta = phaseMeta;
		this.log = simulationState.log;
		this.phaseId = phaseMeta.phaseId;
		/** @type {TickPayload} */ this.lastTickPayload = null;
		// Cues
		/** @type {RuntimeCue[]} */ this.chronologicalCues = [];
	}

	enter() {
		this.chronologicalCues = [...this.phaseMeta.allCues].sort((a, b) =>
			compareGET(a.get, b.get)
		);

		if (typeof this.onEnter === 'function') {
			this.onEnter();
		}
	}

	/**
	 *
	 * @param {TickPayload} tick
	 */
	tick(tick) {
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
	}

	exit() {
		if (typeof this.onExit === 'function') {
			this.onExit();
		}
	}

	onEnter() {
		console.warn('Method not implemented.');
	}
	/**
	 *
	 * @param {TickPayload} tick
	 */
	onTick(tick) {
		console.warn('Method not implemented.');
	}
	onExit() {
		console.warn('Method not implemented.');
	}
}
