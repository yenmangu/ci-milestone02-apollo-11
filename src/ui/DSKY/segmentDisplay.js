/**
 * @typedef {import("../../types/uiTypes.js").SegmentMap} SegmentMap
 * @typedef {import("../../types/uiTypes.js").SegmentKey} SegmentKey
 * @typedef {import('../../types/uiTypes.js').FiveCharSegments} FiveCharSegments
 * @typedef {import('../../types/uiTypes.js').TwoCharSegments} TwoCharSegments
 */

/**
 * @typedef {Record<SegmentKey, string|number>} BulkValue
 */

import {
	fiveCharSegments,
	segmentKeys,
	twoCharSegments
} from '../../types/uiTypes.js';

export class SegmentDisplay {
	/**
	 *
	 * @param {SegmentMap} displays
	 */
	constructor(displays) {
		/** @type {SegmentMap} */ this.displays = displays;
	}
	init() {
		// this.bulkWrite()
		console.log('[SEVEN SEG DISPLAY MAP]: ', this.displays);
		this.setReady();
	}

	setReady() {
		this.bulkWrite({
			r_1: 'ready',
			r_2: 'ready',
			r_3: 'ready',
			prog: 0,
			verb: 0
		});
	}

	/**
	 *
	 * @param {string} value
	 */
	writeVerb(value) {
		this.write('verb', value);
	}

	/**
	 *
	 * @param {string} value
	 */
	writeNoun(value) {
		this.write('noun', value);
	}

	/**
	 *
	 * @param {string} value
	 */
	writeProgram(value) {
		this.write('prog', value);
	}

	/**
	 *
	 * @param {SegmentKey | string} id
	 * @param {string|number} val
	 */
	write(id, val) {
		const key = /** @type {SegmentKey} */ (id);

		if (typeof val === 'number') val = val.toString();

		if (twoCharSegments.includes(key)) {
			val = val.padStart(2, '0');
			if (val.length > 2) {
				throw new Error(`${val} has too many chars. Allowed chars: 2`);
			}
		}

		if (fiveCharSegments.includes(key) && val.length > 5) {
			val = val.padStart(5, '0');
			if (val.length > 5) {
				throw new Error(`${val} has too many chars. Allowed chars: 5`);
			}
		}
		const el = this.displays[id];
		if (el) {
			el.innerText = val;
		}
	}

	/**
	 * Write multiple values to the DSKY display at once
	 *
	 * @param {Record<string, string|number> | Record<SegmentKey, string|number>} values
	 */
	bulkWrite(values) {
		for (const [id, val] of Object.entries(values)) {
			const key = /** @type {SegmentKey} */ (id);

			if (segmentKeys.includes(key)) {
				this.write(key, val);
			} else {
				console.warn(`${id} is not a valid key.
					Valid keys are ${segmentKeys.join(', ')}`);
			}
		}
	}

	clearVerbNoun() {
		this.bulkWrite({ noun: 0, verb: 0 });
	}

	clearAll() {
		this.bulkWrite({
			prog: 0,
			noun: 0,
			verb: 0,
			r_1: 0,
			r_2: 0,
			r_3: 0
		});
	}
}
