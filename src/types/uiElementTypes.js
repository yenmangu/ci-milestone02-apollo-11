/**
 * @typedef {import("./uiTypes.js").SegmentMap} SegmentMap
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
 * @typedef {import("./uiTypes.js").HudElements} HudElements
 * @typedef {keyof HudElements} HudRuntypeKey
 */
