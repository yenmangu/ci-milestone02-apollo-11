import { MissionStateBase } from '../missionStates/missionStateBase.js';

/**
 * @fileoverview Type definitions for game controllers
 * and mission state classes
 */

/**
 * @typedef {import('../game/gameController.js').GameController} GameController
 *
 */

/**
 * @typedef {MissionStateBase} missionStateBase
 */

/**
 * ALL possible states in the application
 * @readonly
 */
const AppStates = {
	// Timeline states (from JSON)
	PRE_START: 'pre_start',
	IDLE: 'idle',
	DESCENT_ORBIT: 'descent_orbit',
	POWERED_DESCENT: 'powered_descent',
	BRAKING_PHASE: 'braking_phase',
	PROG_ALARM_1202: 'program_alarm_1202',
	APPROACH_PHASE: 'approach_phase',
	PROG_ALARM_1201: 'program_alarm_1201',
	FINAL_DESCENT: 'final_descent',
	LANDED: 'landed',
	// Special states (not in JSON)
	FAILED: 'failed',
	PAUSED: 'paused'
};

export const AppStateValuesToKeys = Object.fromEntries(
	Object.entries(AppStates).map(([k, v]) => [v, k])
);

/**
 * @typedef {Object} AppStatesEnum
 * @property {AppStateKey} idle
 * @property {AppStateKey} descent_orbit
 * @property {AppStateKey} powered_descent
 * @property {AppStateKey} braking_phase
 * @property {AppStateKey} program_alarm_1202
 * @property {AppStateKey} approach_phase
 * @property {AppStateKey} program_alarm_1201
 * @property {AppStateKey} final_descent
 * @property {AppStateKey} landed
 * @property {AppStateKey} pre_start
 * @property {AppStateKey} failed
 * @property {AppStateKey} paused
 */

/**
 * @type {AppStatesEnum}
 * @readonly
 */
export const AppStateKeys = {
	idle: 'IDLE',
	descent_orbit: 'DESCENT_ORBIT',
	powered_descent: 'POWERED_DESCENT',
	braking_phase: 'BRAKING_PHASE',
	program_alarm_1202: 'PROG_ALARM_1202',
	approach_phase: 'APPROACH_PHASE',
	program_alarm_1201: 'PROG_ALARM_1201',
	final_descent: 'FINAL_DESCENT',
	landed: 'LANDED',
	pre_start: 'PRE_START',
	failed: 'FAILED',
	paused: 'PAUSED'
};

/**
 * @typedef { 'idle'
 * | 'descent_orbit'
 * | 'powered_descent'
 * | 'braking_phase'
 * | 'program_alarm_1202'
 * | 'approach_phase'
 * | 'program_alarm_1201'
 * | 'final_descent'
 * | 'landed'
 * | 'pre_start'
 * | 'failed'
 * | 'paused' } AppStateValue
 * // union of string values like 'idle' | 'pre_start' | ...
 */

/**
 * @typedef {'IDLE'
 * | 'DESCENT_ORBIT'
 * | 'POWERED_DESCENT'
 * | 'BRAKING_PHASE'
 * | 'PROG_ALARM_1202'
 * | 'APPROACH_PHASE'
 * | 'PROG_ALARM_1201'
 * | 'FINAL_DESCENT'
 * | 'LANDED'
 * | 'PRE_START'
 * | 'FAILED'
 * | 'PAUSED'} AppStateKey
 * // union of keys like 'IDLE' | 'PRE_START' | ...
 */

/**
 * @typedef {typeof AppStates[keyof typeof AppStates]} AppState
 */

/**
 * @typedef {Exclude<AppStateKey, 'PRE_START'|'FAILED'|'PAUSED'>} MissionStateKey
 */

/**
 * @typedef {Exclude<AppStateValue, 'pre_start'|'failed'|'paused'>} MissionStateValue
 */

/**
 * @typedef {Object} DSKYVerbNoun
 * @property {string} verb - The verb code for the DSKY action.
 * @property {string} noun - The noun code for the DSKY action.
 * @property {string} description - Description of the verb-noun action.
 */

/**
 * @typedef {Object} DSKYActionItem
 * @property {string|null} [program] - The DSKY program number or null if none.
 * @property {string|null} [description] - Optional description of the program.
 * @property {DSKYVerbNoun[]} verb_noun - List of verb-noun pairs associated with this program.
 */

/**
 * @typedef {DSKYActionItem[]} DSKYActions
 */

/**
 * @typedef {Object} FailureState
 * @property {string} type
 * @property {string} condition
 * @property {string} audio_ref
 * @property {string} historical_context
 */

/**
 * @typedef {Object} MissionPhase
 * @property {string} state
 * @property {number} start_time
 * @property {string} phase_name
 * @property {string} description
 * @property {number} lunar_altitude
 * @property {string} altitude_units
 * @property {number} velocity_fps
 * @property {number} fuel_percent
 * @property {string } required_action
 * @property {string} audio_ref
 * @property {string} get_stamp
 * @property {Object} [timeline_cues]
 * @property {number} [timeout]
 * @property {Object|null|undefined} [failure_state]
 * @property {DSKYActions|null|undefined} [dsky_actions]
 *
 */

/**
 * @typedef {MissionStateKey} currentState
 * @property {MissionPhase | null} currentPhase
 */

/**
 * @typedef {Object[]} GlobalFailures
 * @property {string} type
 * @property {string} condition
 * @property {string} audio_ref
 * @property {string[]} applies_to
 * @property {string} historical_context
 */

/**
 * @typedef {Object} TimelineMetadata
 * @property {number} time_scale
 * @property {string} velocity_units
 * @property {GlobalFailures} global_failures
 * @property {Object} historical_references
 *
 */

/**
 * @typedef {Object} MissionTimeline
 * @property {MissionPhase[]} mission_phases
 * @property {TimelineMetadata} metadata
 * @property {(state: MissionStateKey|string) => MissionPhase | undefined} getPhase
 */

/**
 * @typedef {Object} TimelineCue
 * @property {string} time
 * @property {string} speaker
 * @property {string} text
 */

/**
 * @typedef {TimelineCue & {
 * seconds: number,
 * shown: boolean,
 * actionKey: string
 * }} TimelineCueRuntime
 */

export { AppStates };
