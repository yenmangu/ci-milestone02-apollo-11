export {};

/**
 * @typedef {import("./timelineTypes.js").PhaseState} PhaseState
 * @typedef {import("./timelineTypes.js").JSON_TimelineCue} JSON_TimelineCue
 * @typedef {import("./timelineTypes.js").JSON_NonTimeAction} JSON_NonTimeAction
 */

/**
 * @typedef {JSON_TimelineCue & {key: string}} RuntimeCue
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
 * @property {RuntimeCue[]} allCues
 * @property {JSON_NonTimeAction[]} nonTimeActions
 * @property {string[]} failStates
 */
