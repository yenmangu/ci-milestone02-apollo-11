/**
 * Convert a GET string e.g. ("102:33:11") to total seconds
 * @param {string} get
 * @returns {number}
 */

export function secondsFromGet(get) {
	const [hh, mm, ss] = get.split(':').map(Number);
	return hh * 3600 + mm * 60 + ss;
}

/**
 * Comparator for sorting GET strings chronologically
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function compareGET(a, b) {
	return secondsFromGet(a) - secondsFromGet(b);
}
