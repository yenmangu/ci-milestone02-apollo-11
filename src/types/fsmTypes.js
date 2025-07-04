export {};

/**
 * @typedef {import("../states/phases/basePhase.js").BasePhase} BasePhase
 * @typedef {import("./timelineTypes.js").PhaseId} PhaseId
 */

/**
 * @typedef {Object.<PhaseId, new (...args: any[]) => BasePhase>} PhaseRegistry
 */
