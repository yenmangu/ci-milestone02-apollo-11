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
 * @typedef {Record<string, HTMLElement>} MappedElement
 */

/**
 * @typedef {Record<keyof HudElements, HTMLElement>} HudMap
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
 * @property {HTMLElement} landing
 * @property {HTMLElement} dsky
 * @property {HTMLElement} preStart
 * @property {HTMLElement} goBack
 */

/**
 * @typedef {Object.<string, HTMLElement>} SegmentDisplayMap
 */

/**
 * @typedef {Object.<string, HTMLElement>} IndicatorLightsMap
 */

/**
 * @typedef {Object.<string, HTMLElement>} StaticDisplayMap
 */

/**
 * @typedef {Object} DSKYStructure
 * @property {SegmentDisplayMap} segmentDisplays
 * @property {IndicatorLightsMap} indicatorLights
 * @property {HTMLElement[]} pushButtons
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
