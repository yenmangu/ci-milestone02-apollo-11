import { DSKYInterface } from '../DSKY/dskyInterface.js';
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
 * @typedef {DSKYInterface}
 */

/**
 * @typedef {MissionStateBase} missionStateBase
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
 * @typedef {Object} MissionStatesKeysEnum
 * @property {MISSION_STATES_KEYS} idle
 * @property {MISSION_STATES_KEYS} descent_orbit
 * @property {MISSION_STATES_KEYS} powered_descent
 * @property {MISSION_STATES_KEYS} braking_phase
 * @property {MISSION_STATES_KEYS} program_alarm_1202
 * @property {MISSION_STATES_KEYS} approach_phase
 * @property {MISSION_STATES_KEYS} program_alarm_1201
 * @property {MISSION_STATES_KEYS} final_descent
 * @property {MISSION_STATES_KEYS} landed
 * @property {MISSION_STATES_KEYS} pre_start
 * @property {MISSION_STATES_KEYS} failed
 * @property {MISSION_STATES_KEYS} paused
 */

/**
 * @type {MissionStatesKeysEnum}
 * @readonly
 */
const MissionStatesKeys = {
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
 * @typedef {'IDLE'
 * |'DESCENT_ORBIT'
 * |'POWERED_DESCENT'
 * |'BRAKING_PHASE'
 * |'PROG_ALARM_1202'
 * |'APPROACH_PHASE'
 * |'PROG_ALARM_1201'
 * |'FINAL_DESCENT'
 * |'LANDED'
 * |'PRE_START'
 * |'FAILED'
 * |'PAUSED'} MISSION_STATES_KEYS
 */

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
 * @typedef {keyof typeof MissionStatesKeys} StatesKeys
 */

/**
 * @typedef {typeof MissionStatesKeys[keyof typeof MissionStatesKeys]} StatesKeysValues
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

export { AppStates, MissionStatesKeys };
