/**
 * @typedef {NodeListOf<HTMLButtonElement>} pushButtons
 */

/**
 * @typedef {Object} DSKYElements
 * @property {NodeListOf<HTMLElement>} staticDisplays
 * @property {NodeListOf<HTMLElement>} sevenSegmentDisplay
 * @property {pushButtons} pushButtons
 */

/**
 * @typedef {NodeListOf<HTMLElement>} instrumentsArray
 * @property {HTMLElement} velocityIndicator
 * @property {HTMLElement} altitudeIndicator
 * @property {HTMLElement} fuelIndicator
 * @property {HTMLElement} timeIndicator
 */

/**
 * @typedef {HTMLElement} StartContainer
 */

/**
 * @typedef {HTMLButtonElement} startButton
 */

/**
 * @typedef {Object} PreStartUIElements
 * @property {HTMLElement} [introText]
 * @property {HTMLElement} animationDisplay
 * @property {HTMLElement} startContainer
 * @property {HTMLElement} startButton
 * @property {NodeListOf<HTMLElement>} instrumentsArray
 * @property {DSKYElements} DSKYElements
 */

/**
 * @typedef {Object} DskyDomElements
 * @property {NodeListOf<HTMLElement>} sevenSegmentDisplays
 * @property {Record<string, HTMLElement>} indicatorLights
 * @property {Record<string, HTMLElement>} displayMap
 * @property {Array<NodeListOf<HTMLElement>>} pushButtons
 * @property {HTMLElement} progLight
 */

/**
 * Display map for the seven-segment displays
 * @typedef {Record<string,HTMLElement>} displayMap
 */

/**
 * @typedef {Record<string,HTMLElement>} lightsMap
 */

export {};
