import { cast } from '../util/cast.js';

export function initSevenSegmentDisplay() {
	/** @type {Record<string, HTMLElement>} */
	const map = {};
	// Debug: Check if .seven-segment exists at all
	// const sevenSegments = document.querySelectorAll('.seven-segment');
	// // console.log('All .seven-segment elements:', sevenSegments);

	// // Debug: Check all spans with IDs in document
	// const allSpansWithIds = document.querySelectorAll('span[id]');
	// // console.log('All spans with IDs in document:', allSpansWithIds);

	document.querySelectorAll('.seven-segment span[id]').forEach(el => {
		// console.log('found segment: ', el);
		const castEl = cast(el);
		map[castEl.id] = castEl;
	});
	// console.debug('Map of seven segment: ', map);
	return map;
}
