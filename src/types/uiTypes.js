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
 * @typedef {Object} UIStructure
 * @property {NodeListOf<HTMLElement>} sevenSegmentDisplays
 * @property {Record<string, HTMLElement>} displayMap
 * @property {Record<string, HTMLElement>} indicatorLights
 * @property {HTMLElement} progLight
 * @property {NodeListOf<HTMLElement>} pushButtons
 * @property {HudMap} hudMap
 * @property {ModalElements} modals
 * @property {UISections} [sections]
 */

export {};
