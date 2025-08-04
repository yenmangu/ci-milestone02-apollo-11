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
		this.flashingFields = new Set();
		this.segmentIntervals = null;
		this.flashInterval = null;
		this.isFlashing = undefined;
	}
	init() {
		// this.bulkWrite()
		console.log('[SEVEN SEG DISPLAY MAP]: ', this.displays);
		this.setLock();
		// this.setReady();
	}

	setLock() {
		this.bulkWrite({
			prog: 0,
			verb: 0,
			noun: 0,
			r_1: 'LOC',
			r_2: 'LOC',
			r_3: 'LOC'
		});
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
	 * @param {SegmentKey} key
	 * @param {string | number} value
	 * @param {number} [interval]
	 * @returns {void}
	 */

	flash(key, value, interval = 200) {
		if (this.flashingFields.has(key)) return;
		if (this.segmentIntervals && this.segmentIntervals[key]) {
			clearInterval(this.segmentIntervals[key]);
			delete this.segmentIntervals[key];
		}

		let isVisible = false;
		this.segmentIntervals = {};
		this.segmentIntervals[key] = setInterval(() => {
			if (isVisible) {
				this.write(key, '');
			} else {
				this.write(key, value);
			}
			isVisible = !isVisible;
		}, interval);
		this.isFlashing = true;
	}

	/**
	 *
	 * @param {SegmentKey | string} key
	 */
	stopFlashTarget(key) {
		if (this.segmentIntervals[key]) {
			clearInterval(this.segmentIntervals[key]);
			delete this.segmentIntervals[key];
		}
	}

	stopFlash() {
		for (const [key, value] of Object.entries(this.segmentIntervals)) {
			clearInterval(this.segmentIntervals[key]);
			delete this.segmentIntervals[key];
		}
		this.segmentIntervals = null;
		this.isFlashing = false;
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
		if (this.flashingFields.has(id)) {
			return;
		}
		// console.log(`writing ${id} with ${val}`);

		const key = /** @type {SegmentKey} */ (id);

		if (typeof val === 'number') val = val.toString();

		if (twoCharSegments.includes(key)) {
			val = val.padStart(2, '0');
			if (val.length > 2) {
				throw new Error(`${val} has too many chars. Allowed chars: 2`);
			}
		}

		if (fiveCharSegments.includes(key)) {
			// console.log('Padding');

			val = val.padStart(5, '0');
			if (val.length > 5) {
				throw new Error(`${val} has too many chars. Allowed chars: 5`);
			}
		}

		// Ensure visual spacing for polarity when blanked
		const polarityFields = ['p_1', 'p_2', 'p_3'];
		if (polarityFields.includes(key)) {
			if (val === '' || val === ' ') {
				val = '&nbsp;';
			}
		}
		const el = /** @type {HTMLElement} */ (this.displays[id]);
		if (el) {
			el.innerHTML = `${val}`;
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
			r_3: 0,
			p_1: '+',
			p_2: '+',
			p_3: '+'
		});
	}
}
