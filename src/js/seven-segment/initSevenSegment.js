import { cast } from '../util/cast.js';

export function initSevenSegmentDisplay() {
	/** @type {Record<string, HTMLElement>} */
	const map = {};

	document.querySelectorAll('.seven-segment span[id]').forEach(el => {
		// console.log('found segment: ', el);
		const castEl = cast(el);
		map[castEl.id] = castEl;
	});
	// console.debug('Map of seven segment: ', map);
	return map;
}
