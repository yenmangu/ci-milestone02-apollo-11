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
 * @property {SegmentDisplayMap} segmentDisplays
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
