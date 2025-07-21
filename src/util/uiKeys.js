/**
 * @typedef {import("../types/uiTypes.js").HudElKey} HudElKey
 */

import { hudKeyMap } from '../types/uiTypes.js';

/**
 *
 * @param {HudElKey} elementId
 */
export function getHudKey(elementId) {
	return hudKeyMap[elementId];
}
