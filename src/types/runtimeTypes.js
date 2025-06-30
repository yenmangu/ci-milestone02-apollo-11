export {};

/**
 * @typedef {import("./timelineTypes.js").PhaseState} PhaseState
 * @typedef {import("./timelineTypes.js").JSON_TimelineCue} JSON_TimelineCue
 */

/**
 * @typedef {Object} RuntimePhase
 * @property {string} phaseId
 * @property {string} phaseName
 * @property {string} description
 * @property {string} startGET
 * @property {string} [endGET]
 * @property {PhaseState} initialState
 * @property {PhaseState} endState
 * @property {Object.<string,JSON_TimelineCue>} cuesByKey
 */
