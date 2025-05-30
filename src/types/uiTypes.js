/**
 * @typedef {NodeListOf<HTMLButtonElement>} pushButtons
 */

/**
 * @typedef {Object} DSKYElements
 * @property {NodeListOf<HTMLElement>} staticDisplays
 * @property {NodeListOf<HTMLElement>} sevenSegmentDisplay
 * @property {pushButtons} pushButtons
 */

export const TelemetryKeys = {
	velocity: 'velocity_fps',
	altitude: 'lunar_altitude',
	altitudeUnits: 'altitude_units',
	fuel: 'fuel_percent',
	phaseName: 'phase_name',
	startTime: 'start_time'
};

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
 * @typedef {Record<string,HTMLElement>} HudElement
 */

/**
 * @typedef {Object} HudElements
 * @property {HTMLElement} lunar_altitude - Displays the current altitude above the lunar surface.
 * @property {HTMLElement} velocity_fps - Displays current descent velocity in feet per second.
 * @property {HTMLElement} fuel_percent - Displays remaining fuel percentage.
 * @property {HTMLElement} start_time - Displays the mission time since start (MM:SS or similar).
 * @property {HTMLElement} phase_name - Displays the current mission phase label.
 * @property {HTMLElement} altitude_units - Displays the current altitude units label (m or ft).
 *
 *
 */

/**
 * @typedef {HudElements} hudMap
 */

/**
 * @typedef {Object} DskyDomElements
 * @property {NodeListOf<HTMLElement>} sevenSegmentDisplays
 * @property {Record<string, HTMLElement>} indicatorLights
 * @property {Record<string, HTMLElement>} displayMap
 * @property {Array<NodeListOf<HTMLElement>>} pushButtons
 * @property {HTMLElement} progLight
 * @property {hudMap} hudMap
 */

/**
 * Display map for the seven-segment displays
 * @typedef {Record<string,HTMLElement>} displayMap
 */

/**
 * @typedef {Record<string,HTMLElement>} lightsMap
 */

export {};
