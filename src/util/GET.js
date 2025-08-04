/**
 * Convert a GET string e.g. ("102:33:11") to total seconds
 * @param {string} get
 * @returns {number}
 */

export function secondsFromGet(get) {
	if (typeof get !== 'string' || !get.includes(':')) {
		throw new Error(`Invalid GET format: ${get}`);
	}
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

/**
 *
 * @param {number} seconds
 * @returns {string}
 */
export function getFromSeconds(seconds) {
	const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
	const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
	const ss = String(seconds % 60).padStart(2, '0');
	return `${hh}:${mm}:${ss}`;
}

/**
 *
 * @param {number} seconds
 * @returns {string}
 */
export function getCountdownString(seconds) {
	const h = String(Math.floor(seconds / 3600)).padStart(1, '0');
	const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
	const ss = String(seconds % 60).padStart(2, '0');
	return `${h}${mm}${ss}`;
}
