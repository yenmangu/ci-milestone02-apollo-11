/**
 * @typedef {import("../types/uiTypes.js").RegisterTypeMap} DskyRegisters
 * @typedef {import("../types/clockTypes.js").TickPayload} TickPayload
 */

// --- Shared helpers (module scope) ---

/**
 *
 * @param {number} n
 * @returns {'+'|'-'}
 */
function polarity(n) {
	return n < 0 ? '-' : '+';
}

/**
 * Legacy magnitude encoder (kept for N62/N63 compatibility).
 * @param {number} n
 * @param {number} [digits=5]
 * @returns {string}
 */
function encodeMagnitude(n, digits = 5) {
	const s = Math.abs(Math.round(n)).toString();
	return s.length > digits ? s.slice(-digits) : s.padStart(digits, '0');
}

/**
 * Clamp a number to an integer within a closed range.
 * values are rounded first then restriced between lo and hi.
 *
 * @param {number} n
 * @param {number} lo
 * @param {number} hi
 * @returns {number} Clamped integer in [lo..hi]
 */
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(n) || 0)));

/**
 * Format a number as a 2-digit string for DSKY.
 * Values outside of 00-99 are clamped, then zero-padded.
 *
 * @param {number} n
 * @returns {string} Two-char string, "00"-"99"
 */
const pad2 = n => String(clamp(n, 0, 99)).padStart(2, '0');

/**
 * Format a number as a 5-digit string for DSKY.
 * Values outside of 00000-99999 are clamped, then zero-padded.
 *
 * @param {number} n
 * @returns {string} Five-char string, "00000"-"99999"
 */
const pad5 = n => String(clamp(Math.abs(n), 0, 99999)).padStart(5, '0');

/**
 * Get the sign character for signed registers.
 *
 * @param {number} v
 * @param {boolean} [blankPositive=false] show " " instewad of "+"
 * @returns {'+' | '-' | ' '} "-" if negative, "+" or " " if non-negative
 */
const signChar = (v, blankPositive = false) =>
	v < 0 ? '-' : blankPositive ? ' ' : '+';

/**
 * Get the 5-digit magnitude of an altitude rate.
 *
 * @param {number} v
 * @returns {string} unsigned 5-digit string
 */
const rateMag5 = v => pad5(Math.abs(v));

// --- Exported methods ---
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
 * @param {number} params.lpdAngle               degrees 0..99
 * @param {number} params.redesignationSeconds   seconds 0..99
 * @param {number} params.altitudeRateFps        ft/s (negative means descending)
 * @param {number} params.altitudeFeet           AGL feet
 * @param {Object} [opts]
 * @param {boolean} [opts.positiveSignBlank=false] if true show ' ' instead of '+'
 * @param {"LPD_LEFT" | "TGO_LEFT"} [opts.order="LPD_LEFT"]
 * order of R1 values, with default being `LPD_LEFT`
 * @returns {DskyRegisters}                      Segment payload for your SegmentDisplay
 */
export function makeV06N64(
	{ lpdAngle, redesignationSeconds, altitudeRateFps, altitudeFeet },
	opts = {}
) {
	const { positiveSignBlank = false, order = 'LPD_LEFT' } = opts;

	// To keep faithful to authenticity:
	// AA = landing point designator angle (LPD angle)
	// TT = time remaining for landing point redesignation
	// R1 = `AA␠TT`

	const AA = pad2(lpdAngle);
	const TT = pad2(redesignationSeconds);

	// Use `opts.order` to determine which order the R1 should display the values

	const r1 = order === 'TGO_LEFT' ? `${TT} ${AA}` : `${AA} ${TT}`;

	return {
		verb: '06',
		noun: '64',
		prog: '64',

		// R1 split fields
		p_1: ' ',
		r_1: r1,

		p_2: signChar(altitudeRateFps, positiveSignBlank),
		r_2: rateMag5(altitudeRateFps),

		r_3: pad5(altitudeFeet)
	};
}
