export {};

/**
 * @typedef {import("./timelineTypes.js").PhaseId} PhaseId
 * @typedef {import ("../states/phases/basePhase.js").BasePhase} BasePhase
 * @typedef {import("./runtimeTypes.js").RuntimePhase} RuntimePhase
 * @typedef {import("../states/simulationState.js").SimulationState} SimulationState



/**
 * @typedef {Record<
 * 		PhaseId,
 * 		new (
 * 			simulationState: SimulationState,
 * 			phaseMeta: RuntimePhase
 * 		) => BasePhase
 * >} PhaseRegistry
 */
