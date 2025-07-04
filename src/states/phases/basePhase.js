/**
 * @typedef {import("../simulationState.js").SimulationState} SimulationState
 * @typedef {import("../../types/timelineTypes.js").PhaseId} PhaseId
 */

export class BasePhase {
	/**
	 *
	 * @param {SimulationState} simulationState
	 * @param {PhaseId} phaseId
	 * @param {*} phaseMeta
	 */
	constructor(simulationState, phaseId, phaseMeta) {
		this.simulationState = simulationState;
		this.phaseMeta = phaseMeta;
		this.log = simulationState.log;
	}

	enter() {
		if (typeof this.onEnter === 'function') {
			this.onEnter();
		}
	}

	tick() {
		if (typeof this.onTick === 'function') {
			this.onTick();
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
	onTick() {
		console.warn('Method not implemented.');
	}
	onExit() {
		console.warn('Method not implemented.');
	}
}
