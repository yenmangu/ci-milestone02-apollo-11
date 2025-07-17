/**
 * @typedef {Object} HudElements
 * @property {HTMLElement} altitude
 * @property {HTMLElement} altitude_units
 * @property {HTMLElement} velocity
 * @property {HTMLElement} fuel
 * @property {HTMLElement} phaseName
 * @property {HTMLElement} transcript
 * @property {HTMLElement} [prompt]
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
 * @property {string} [cueTranscript]
 * @property {string} [prompt]
 */

/**
 * @typedef {'altFeet' | 'altMiles' | 'velocity' | 'vUnits' | 'fuel'} TelemetryKey
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

/** @type {string[]} */
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
 * Shorthand getter for typed HTML elements
 *
 * @param {string} id
 * @returns {HTMLElement}
 */
const getEl = id => /** @type {HTMLElement} */ (document.getElementById(id));

/** @type {SegmentMap} */
export const sevenSegmentMap = {
	prog: getEl('prog'),
	verb: getEl('prog'),
	noun: getEl('prog'),
	p_1: getEl('prog'),
	r_1: getEl('prog'),
	r_2: getEl('prog'),
	p_2: getEl('prog'),
	p_3: getEl('prog'),
	r_3: getEl('prog')
};

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
 * @typedef {Object} UIStructure
 * @property {HudMap} hudMap
 * @property {DSKYStructure} dsky
 * @property {ModalElements} modals
 * @property {UISections} [sections]
 */

export {};
