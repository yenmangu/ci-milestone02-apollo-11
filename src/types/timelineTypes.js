export {};

/**
 * @typedef {Object} Altitude
 * @property {number} miles
 * @property {number} feet
 */

/**
 * @typedef {Object} PhaseState
 * @property {number} velocity
 * @property {string} v_units
 * @property {Altitude} altitude
 * @property {number} fuel
 */

/**
 * @typedef {Object} JSON_TimelineCueData
 * @property {string} [text]
 * @property {string} [speaker]
 * @property {string} [verb]
 * @property {string} [noun]
 * @property {string} [program]
 */

/**
 * @typedef {Object} JSON_FailsAfter
 * @property {string} get
 * @property {string} name
 * @property {string} context
 */

/**
 * @typedef {Object} JSON_TimelineCue
 * @property {string} get
 * @property {boolean} [transcript]
 * @property {boolean} [dsky]
 * @property {boolean} [hud]
 * @property {boolean} [input]
 * @property {boolean} [output]
 * @property {boolean} [semantic]
 * @property {string} [context]
 * @property {string} [key]
 * @property {string} [requires_action]
 * @property {JSON_TimelineCueData} data
 * @property {JSON_FailsAfter} [fails_after]
 * @property {string} [triggers]
 */

/**
 * @typedef {Object} JSON_NonTimeAction
 * @property {string} [verb]
 * @property {string} [noun]
 * @property {string} [program]
 * @property {string} [action]
 * @property {string} description
 */

/**
 * @typedef {Object} JSON_MissionPhase
 * @property {string} phase_name
 * @property {string} phase_id
 * @property {string} start_get
 * @property {string} description
 * @property {PhaseState} initial_state
 * @property {PhaseState} end_state
 * @property {JSON_TimelineCue[]} timeline_cues
 * @property {JSON_NonTimeAction[]} [non_time_specific_actions]
 * @property {string[]} [fail_states]
 */

/**
 * @typedef {Object} JSON_InterruptData
 * @property {string} [text]
 * @property {string} [context]
 */

/**
 * @typedef {Object} JSON_RuntimeInterrupt
 * @property {string} name
 * @property {string|null} trigger_get
 * @property {string[]} [phase_context]
 * @property {string} interrupt_code
 * @property {string} [alarm_code]
 * @property {string} description
 * @property {string[]} [context]
 * @property {boolean} [hud]
 * @property {boolean} [dsky]
 * @property {boolean} [input]
 * @property {boolean} [output]
 * @property {boolean} [semantic]
 * @property {string} requires_action
 * @property {'info' | 'warning' | 'fatal'} [severity]
 * @property {string} [condition]
 * @property {string} [audio_ref]
 */
