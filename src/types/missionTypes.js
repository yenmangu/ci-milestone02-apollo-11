import { MissionState } from '../missionStates/missionState.js';

/**
 * @fileoverview Type definitions for game controllers
 * and mission state classes
 */

/**
 * @typedef {import('../game/gameController.js').GameController} GameController
 *
 */

/**
 * @typedef {new (game: GameController, key:AppStatesKeys) => MissionState} MissionStateContructor
 */

/**
 * @typedef {Object} StatesEnum
 * @property {string} PRE_START
 * @property {string} IDLE
 * @property {string} DESCENT_ORBIT
 * @property {string} POWERED_DESCENT
 * @property {string} BRAKING_PHASE
 * @property {string} PROG_ALARM_1202
 * @property {string} APPROACH_PHASE
 * @property {string} PROG_ALARM_1201
 * @property {string} FINAL_DESCENT
 * @property {string} LANDED
 * @property {string} FAILED
 * @property {string} PAUSED
 */

/**
 * ALL possible states in the application
 * @readonly
 */
const AppStates = {
	// Timeline states (from JSON)
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
	PRE_START: 'pre_start',
	FAILED: 'failed',
	PAUSED: 'paused'
};

/**
 * @typedef {Object} FailureState
 * @property {string} type
 * @property {string} condition
 * @property {string} audio_ref
 * @property {string} historical_context
 */

/**
 * @typedef {'idle'
 * |'descent_orbit'
 * |'powered_descent'
 * |'braking_phase'
 * |'program_alarm_1202'
 * |'approach_phase'
 * |'program_alarm_1201'
 * |'final_descent'
 * |'landed'} MissionStateKey
 */

/**
 * @typedef {keyof typeof AppStates} AppStatesKeys
 */

/**
 * @typedef {typeof AppStates[keyof typeof AppStates]} AppStatesValues
 */

/**
 * @typedef {Exclude<AppStatesValues, 'failed'|'paused'>} TimelineState
 */

/**
 * @typedef {Object} MissionPhase
 * @property {TimelineState} state
 * @property {number} start_time
 * @property {string} phase_name
 * @property {string} description
 * @property {number} lunar_altitude
 * @property {string} altitude_units
 * @property {number} velocity_fps
 * @property {number} fuel_percent
 * @property {string} required_action
 * @property {string} audio_ref
 * @property {number} [timeout]
 * @property {Object|null} failure_state
 */

/**
 * @typedef {Object} AppState
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

export { AppStates };
