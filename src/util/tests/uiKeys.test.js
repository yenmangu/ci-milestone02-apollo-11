/**
 * @typedef {import('../../types/uiTypes.js').HudElKey} HudElKey
 */

import { jest } from '@jest/globals';
import { getHudKey } from '../uiKeys.js';
import { hudKeyMap } from '../../types/uiTypes.js';

describe('testing the hudKey generation', () => {
	const elKeys = Object.keys(hudKeyMap);
	/** @type {HudElKey[]} */ let typedKeys = [];
	elKeys.forEach(
		/** @type {string} */ key => {
			typedKeys.push(/** @type {HudElKey} */ (key));
		}
	);

	test('providing hudElementKey should return correct mapped key', () => {
		const altUnits = getHudKey(typedKeys[0]);
		expect(altUnits).toBe('altUnits');
		const cueTranscript = getHudKey(typedKeys[5]);
		expect(cueTranscript).toBe('cueTranscript');
		const prompt = getHudKey(typedKeys[7]);
		expect(prompt).toBe('prompt');
		console.log('[TypedKeys]: ', typedKeys);

		const map = {};
		for (const [key, val] of Object.entries(hudKeyMap)) {
			map[key] = getHudKey(/** @type {HudElKey} */ (key));
		}
		console.log('[Mapped]: ', map);
	});
});
