/**
 * @typedef {import("../types/uiTypes.js").RegisterTypeMap} DskyRegisters
 * @typedef {import("../types/clockTypes.js").TickPayload} TickPayload
 */

/**
 *
 * @param {number} n
 * @returns {'+'|'-'}
 */
function polarity(n) {
	return n < 0 ? '-' : '+';
}

/**
 *
 * @param {number} n
 * @param {number} [digits=5]
 * @returns {string}
 */
function encodeMagnitude(n, digits = 5) {
	const s = Math.abs(Math.round(n)).toString();
	return s.length > digits ? s.slice(-digits) : s.padStart(digits, '0');
}

/**
 *
 * @param {number} absoluteVelocity
 * @param {number} secondsToIgnition
 * @param {number} deltaVFtPerSec
 * @returns {DskyRegisters}
 */
export function makeV06N62(absoluteVelocity, secondsToIgnition, deltaVFtPerSec) {
	const mm = Math.floor(Math.abs(secondsToIgnition) / 60);
	const ss = Math.abs(secondsToIgnition) % 60;
	const sign = secondsToIgnition < 0 ? '-' : '+';
	return {
		prog: '63',
		verb: '06',
		noun: '62',
		r_1: encodeMagnitude(absoluteVelocity),
		p_2: sign,
		r_2: `${mm.toString().padStart(2, '0')}${ss.toString().padStart(2, '0')}`,
		r_3: encodeMagnitude(deltaVFtPerSec)
	};
}

/**
 *
 * @param {number} absoluteVelocity
 * @param {number} altRateFps
 * @param {number} altitudeFeet
 * @returns {DskyRegisters}
 */
export function makeV06N63(absoluteVelocity, altRateFps, altitudeFeet) {
	/** @type {DskyRegisters} */
	const out = {
		prog: '63',
		verb: '06',
		noun: '63',
		p_1: polarity(absoluteVelocity),
		r_1: encodeMagnitude(absoluteVelocity),
		p_3: polarity(altitudeFeet),
		r_3: encodeMagnitude(altitudeFeet)
	};

	if (typeof altRateFps === 'number') {
		out.p_2 = polarity(altRateFps);
		out.r_2 = encodeMagnitude(altRateFps);
	}
	return out;
}

/**
 * Build DSKY payload for V06 N64 (P64).
 *
 * R1: [LPD angle][Tgo]  -> two 2-char fields
 * R2: Altitude rate     -> signed, 5 chars (e.g. "-0022")
 * R3: Altitude (feet)   -> 5 chars (e.g. "49914")
 *
 * @param {Object} params
 * @param {number} params.lpdAngle               // degrees 0..99
 * @param {number} params.redesignationSeconds   // seconds 0..99
 * @param {number} params.altitudeRateFps        // ft/s (negative means descending)
 * @param {number} params.altitudeFeet           // AGL feet
 * @returns {Object}                             // segment payload for your SegmentDisplay
 */
export function makeV06N64({
	lpdAngle,
	redesignationSeconds,
	altitudeRateFps,
	altitudeFeet
}) {}
