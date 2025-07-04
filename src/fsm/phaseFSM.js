/**
 * @typedef {import("../states/simulationState.js").SimulationState} SimulationState
 * @typedef {import("../types/runtimeTypes.js").MissionTimeline} MissionTimeline
 * @typedef {import("../types/timelineTypes.js").PhaseId} PhaseId
 * @typedef {import('../types/fsmTypes.js').PhaseRegistry} PhaseRegistry
 * @typedef {import('../types/fsmTypes.js').BasePhase} BasePhase
 */

import { isValidPhaseId } from '../types/timelineTypes.js';

export class PhaseFSM {
	/** @type {BasePhase} */ currentPhaseInstance;
	currentPhaseId;
	currentPhaseMeta;
	previousPhaseInstance;
	/**
	 *
	 * @param {SimulationState} simulationState
	 * @param {MissionTimeline} missionTimeline
	 * @param {PhaseRegistry} phaseRegistry
	 */
	constructor(simulationState, missionTimeline, phaseRegistry) {
		this.simulationState = simulationState;
		this.timeline = missionTimeline;
		this.phaseRegistry = phaseRegistry;
		this.currentGET = simulationState.currentGet;
		this.previousPhaseInstance = null;

		this.devMode = simulationState.devMode;
	}

	/**
	 * @description Transitions to phase by phaseId
	 * Safely checks if currentPhase can be closed (exit())
	 * @param {PhaseId} newPhaseId
	 */
	transitionTo(newPhaseId) {
		if (this.devMode) {
			isValidPhaseId(newPhaseId);
		}

		if (
			this.currentPhaseInstance &&
			typeof this.currentPhaseInstance.exit === 'function'
		) {
			this.currentPhaseInstance.exit();
		}
		this.previousPhaseInstance = this.currentPhaseInstance;
		this.currentPhaseId = newPhaseId;

		// Search timeline.phases for object where phase_id = newPhaseId
		const phaseMeta = this.timeline.getPhase(newPhaseId);
		if (!phaseMeta) {
			throw new Error(`Phase metadata not found for phase ID: ${newPhaseId}`);
		}

		// Instantiate phaseClass from phase metadata
		/** @type {BasePhase} */
		const newPhaseInstance = new this.phaseRegistry[newPhaseId](
			this.simulationState,
			phaseMeta
		);

		if (newPhaseInstance) {
			this.currentPhaseInstance = newPhaseInstance;
			this.currentPhaseInstance.enter();
		}
	}
}
