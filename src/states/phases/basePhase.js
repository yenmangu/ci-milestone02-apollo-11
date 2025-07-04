/**
 * @typedef {import("../simulationState.js").SimulationState} SimulationState
 * @typedef {import("../../types/timelineTypes.js").PhaseId} PhaseId
 * @typedef {import("../../types/runtimeTypes.js").RuntimePhase} RuntimePhase
 */

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
	}

	enter() {
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
