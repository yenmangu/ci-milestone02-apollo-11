/**
 *
 * @typedef {'hud-altitude_units'
 * |'hud-lunar_altitude'
 * |'hud-velocity_fps'
 * |'hud-fuel_percent'
 * |'hud-get_stamp'
 * |'hud-phase_name'
 * |'hud-transcript'
 * |'hud-prompt' } HudElKey
 */

/**
 * @type {{[k in HudElKey] : string}}
 */
export const hudKeyMap = {
	'hud-altitude_units': 'altUnits',
	'hud-lunar_altitude': 'altitude',
	'hud-fuel_percent': 'fuel',
	'hud-velocity_fps': 'velocity',
	'hud-get_stamp': 'getStamp',
	'hud-transcript': 'transcript',
	'hud-phase_name': 'phaseName',
	'hud-prompt': 'prompt'
};

/**
 * @typedef {Object} HudElements
 * @property {HTMLElement} altitude
 * @property {HTMLElement} altUnits
 * @property {HTMLElement} velocity
 * @property {HTMLElement} fuel
 * @property {HTMLElement} phaseName
 * @property {HTMLElement} transcript
 * @property {HTMLElement} [prompt]
 * @property {HTMLElement} getStamp
 */

/**
 * @typedef {Record.<string, HTMLElement>} MappedElement
 */

/**
 * @typedef {Record.<keyof HudElements, HTMLElement>} HudMap
 */

/**
 * @typedef {import("./timelineTypes.js").Altitude} Altitude
 */

/**
 * @typedef {Object} UIState
 * @property {Altitude} [altitude]
 * @property {number} [velocity]
 * @property {string} [vUnits]
 * @property {number} [fuel]
 * @property {string} [transcript]
 * @property {string} [getStamp]
 * @property {string} [prompt]
 * @property {string} [phaseName]
 */

/**
 * @typedef {'altFeet' | 'altMiles' | 'velocity' | 'vUnits' | 'fuel' } TelemetryKey
 */

/**
 * @typedef {Object} Telemetry
 * @property {string} altitude
 * @property {string} altUnits
 * @property {string} velocity
 * @property {string} vUnits
 * @property {string} fuel
 */

/**
 * @typedef {'feet' | 'miles'} altitudeUnits
 */

/**
 * @typedef {Object} ModalElements
 * @property {HTMLElement} instruction
 * @property {HTMLElement} next
 * @property {HTMLButtonElement} nextPhase
 * @property {HTMLButtonElement} verifyButton
 */

/**
 * @typedef {Record<keyof ModalElements, HTMLElement>} ModalMap
 */

/**
 * @typedef {Object} UISections
 * @property {HTMLElement} dsky
 * @property {HTMLElement} landing
 * @property {HTMLElement} lemAnimation
 */

/**
 * @typedef {'prog'|'verb'|'noun'|'p_1'|'r_1'|'p_2'|'r_2'|'p_3'|'r_3'} SegmentKey
 */

/**
 * @typedef {'r_1'|'r_2'|'r_3'} FiveCharSegments
 */

/**
 *
 * @typedef {'verb' | 'noun' | 'prog'} TwoCharSegments
 */

/** @type {SegmentKey[]} */
export const fiveCharSegments = ['r_1', 'r_2', 'r_3'];

/** @type {SegmentKey[]} */
export const twoCharSegments = ['prog', 'verb', 'noun'];

/** @type {SegmentKey[]} */
export const segmentKeys = [
	'prog',
	'verb',
	'noun',
	'p_1',
	'r_1',
	'p_2',
	'r_2',
	'p_3',
	'r_3'
];

/**
 * Concrete map of all known seven-segment display fields.
 *
 * @typedef {Object} SegmentMap
 * @property {HTMLElement} prog
 * @property {HTMLElement} verb
 * @property {HTMLElement} noun
 * @property {HTMLElement} p_1
 * @property {HTMLElement} r_1
 * @property {HTMLElement} p_2
 * @property {HTMLElement} r_2
 * @property {HTMLElement} p_3
 * @property {HTMLElement} r_3
 */

/**
 * @typedef {Record.<string, HTMLElement>} SegmentDisplayMap
 */

/**
 * @typedef {Record.<string, HTMLElement>} IndicatorLightsMap
 */

/**
 * @typedef {Record.<string, HTMLElement>} StaticDisplayMap
 */

/**
 * @typedef {Record.<string, HTMLButtonElement>} PushButtonsMap
 */

/**
 * @typedef {Object} DSKYStructure
 * @property {SegmentMap} segmentDisplays
 * @property {IndicatorLightsMap} indicatorLights
 * @property {PushButtonsMap} pushButtons
 * @property {HTMLElement} progLight
 * @property {StaticDisplayMap} [staticDisplays]
 */

/**
 * @typedef {Record.<string, HTMLButtonElement>} ControlMap
 */

/**
 * @typedef {Object} Controls
 * @property {HTMLButtonElement} playPause
 * @property {HTMLButtonElement} start
 * @property {HTMLButtonElement} fastForward
 */

/**
 * @typedef {Object} UIStructure
 * @property {HudMap} hudMap
 * @property {HTMLElement} description
 * @property {Controls} controls
 * @property {DSKYStructure} dsky
 * @property {ModalElements} modals
 * @property {UISections} [sections]
 * @property {HTMLElement} [desktopDescription]
 */

export {};
