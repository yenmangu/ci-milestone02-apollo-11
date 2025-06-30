export {};

/**
 * This defines the shape of the data to be used within the actual src.
 * All snake case has been transformed to camel casing.
 * The method `getPhase()` has been added to provide a means to return the phase data.
 */

import { PhaseIds } from './timelineTypes.js';

/**
 * @typedef {import('./timelineTypes.js').PhaseId} PhaseId
 */

/**
 * @typedef {import("./timelineTypes.js").PhaseState} PhaseState
 * @typedef {import("./timelineTypes.js").JSON_TimelineCue} JSON_TimelineCue
 * @typedef {import("./timelineTypes.js").JSON_NonTimeAction} JSON_NonTimeAction
 * @typedef {import('./timelineTypes.js').JSON_TimelineMetadata} JSON_TimelineMetadata
 * @typedef {import('./timelineTypes.js').JSON_historical_context} JSON_historical_context
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
 * @property {Object.<string, RuntimeCue>} cuesByKey
 * @property {RuntimeCue[]} allCues
 * @property {JSON_NonTimeAction[]} nonTimeActions
 * @property {string[]} failStates
 */

/**
 * @typedef {Object} TimelineMetadata
 * @property {number} timeScale
 * @property {JSON_historical_context} historicalContext
 */

/**
 * @typedef {Object} MissionTimeline
 * @property {RuntimePhase[]} runtimePhases
 * @property {TimelineMetadata} metadata
 * @property {(state: PhaseId|string )=> RuntimePhase | undefined} getPhase
 */
