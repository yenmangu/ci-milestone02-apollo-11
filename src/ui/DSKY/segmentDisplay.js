/**
 * @typedef {import("../../types/uiTypes.js").SegmentDisplayMap} SegmentDisplays
 */

export class SegmentDisplay {
	/**
	 *
	 * @param {SegmentDisplays} displays
	 */
	constructor(displays) {
		/** @type {SegmentDisplays} */ this.displays = displays;
	}

	write() {
		console.warn('method not implemented');
	}
	bulkWrite() {
		console.warn('method not implemented');
	}
	clearVerbNoun() {
		console.warn('method not implemented');
	}
	clearAll() {
		console.warn('method not implemented');
	}
}
