/**
 * @typedef {Object} RawTelemetry
 * @property {{ miles: number, feet: number}} altitude
 * @property {number} velocity
 * @property {string} vUnits
 * @property {number} fuel
 */

/**
 * @typedef {import("../types/clockTypes.js").TickPayload} TickPayload
 * @typedef {import("../types/uiTypes.js").Telemetry} Telemetry
 */

/**
 *
 * @param {RawTelemetry} rawTelemetry
 * @returns {Telemetry}
 */
export function formatTelemetryForUI(rawTelemetry) {
	return {
		altitude: Math.round(rawTelemetry.altitude.feet).toString(),
		altUnits: 'feet',
		velocity: Math.round(rawTelemetry.velocity).toString(),
		vUnits: rawTelemetry.vUnits,
		fuel: Math.round(rawTelemetry.fuel).toString()
	};
}

/**
 * Altitude rate calculator (ft/s)
 *
 * @param {number} [alpha=0.35]
 * Smoothing factor in [0,1]. 0 = no update, 1 = no smoothing
 */

export function createAltitudeRateCalculator(alpha = 0.35) {
	/** @type {number|null} */ let prevAltFt = null;
	/** @type {number|null} */ let prevTimeS = null;
	/** @type {number|null} */ let emaRate = null;

	/**
	 * Update with current alt (ft) and tick time (s)
	 *
	 * @param {number} altitudeFeet
	 * @param {number} timeSeconds
	 * @returns {number|null}
	 */
	function update(altitudeFeet, timeSeconds) {
		if (prevAltFt == null || prevTimeS == null) {
			prevAltFt = altitudeFeet;
			prevTimeS = timeSeconds;
			return null;
		}

		const dt = timeSeconds - prevTimeS;

		// Guard: weird ticks (paused, duplicate, or clock jump)

		if (dt <= 0 || !Number.isFinite(dt)) {
			prevAltFt = altitudeFeet;
			prevTimeS = timeSeconds;
			// Keep last good estimate
			return emaRate;
		}

		// Raw derivative (ft/s) Descending altitude => negative rate.

		const raw = (altitudeFeet - prevAltFt) / dt;

		emaRate = emaRate === null ? raw : alpha * raw + (1 - alpha) * emaRate;

		prevAltFt = altitudeFeet;
		prevTimeS = timeSeconds;
		return emaRate;
	}

	/**
	 * Read latest filtered rate without updating
	 *
	 * @returns {number|null}
	 */
	function get() {
		return emaRate;
	}

	return { update, get };
}

const LPD_STUB_POINTS = [
	{ alt: 7400, angle: 37 }, // high gate (~P64 entry)
	{ alt: 6000, angle: 39 },
	{ alt: 5000, angle: 41 }, // "mid-gate" neighbourhood
	{ alt: 4000, angle: 43 },
	{ alt: 3000, angle: 46 },
	{ alt: 2000, angle: 50 },
	{ alt: 1000, angle: 57 },
	{ alt: 500, angle: 64 },
	{ alt: 200, angle: 72 }
];

/**
 * Returns 'plausible' (not historical) angles keyed by altitude;
 * linearly interpolates between the points.
 * Returns nearest endpoint value if supplied altitude outside of table range.
 * Angles gently increase as altitude decreases, to mimic the
 * 'forward-fly' tendency of the Apollo 11 LM.
 *
 * @param {number} altitudeFeet
 * @returns {number} integer LPD angle
 */
export function getLpdAngleForAltitude(altitudeFeet) {
	const pts = LPD_STUB_POINTS;
	if (altitudeFeet >= pts[0].alt) return pts[0].angle;
	if (altitudeFeet <= pts[pts.length - 1].alt) return pts[pts.length - 1].angle;

	// find surrounding segment

	for (let i = 0; i < pts.length - 1; i++) {
		const hi = pts[i];
		const lo = pts[i + 1];

		if (altitudeFeet <= hi.alt && altitudeFeet >= lo.alt) {
			const t = (hi.alt - altitudeFeet) / (hi.alt - lo.alt);
			const ang = hi.angle + t * (lo.angle - hi.angle);
			return Math.max(0, Math.min(99, Math.round(ang)));
		}
	}

	// fallback (shouldn't hit)
	return pts[pts.length - 1].angle;
}

/**
 * Historical P64 redesignation window (Apollo 11)
 *
 * Souces vary; 20-30s is typical after pitch-over
 * Midpoint chosen for stability
 *
 * @constant
 * @type {number}
 */
export const HISTORICAL_REDESIG_WINDOW_SEC = 25;

/**
 * Create Apollo 11 landing redesignation counter.
 *
 * @param {number} startSec
 * @returns {(nowSec: number) => number}
 */
export function createApollo11RedesigCounter(startSec) {
	return createRedesignationCounter(startSec, HISTORICAL_REDESIG_WINDOW_SEC);
}

/**
 * Create a redesignation countdown function.
 *
 * Defaults to a 99s window starting at `startSec`, clamped to 0..99
 * for the two-char DSKY fields. Swap logic later to match a gate/cue/altitude
 * based cutoff without touching phase.
 *
 * @param {number}  startSec
 * @param {number} [windowSec=99]
 * @returns {(nowSec: number) => number} returns 0..99
 */
export function createRedesignationCounter(startSec, windowSec = 99) {
	const cutoff = Math.floor(startSec) + windowSec;

	/**
	 * @param {number} nowSec
	 * @returns {number}
	 */
	return function getRedesignationSeconds(nowSec) {
		let remain = Math.floor(cutoff - nowSec);
		if (remain < 0) remain = 0;
		if (remain > 99) remain = 99;
		return remain;
	};
}

/**
 * Calculate horizontal velocity (ft/s) from total speed and vertical rate.
 * Guards against floating-point noise when v_total ≈ v_vertical.
 *
 * @param {number} velocity Total speed (ft/s)
 * @param {number} altRateFps Vertical rate (ft/s, signed; negative = descending)
 *
 * @returns {number} Horizontal speed (ft/s, unsigned)
 */
export function toHorizontalFeetPerSecond(velocity, altRateFps) {
	const vT = Number.isFinite(velocity) ? velocity : 0;
	const vV = Number.isFinite(altRateFps) ? altRateFps : 0;
	// Subtract a tiny epsilon to absorb floating point rounding when vT ≈ vV
	// Protects against NaN errors
	const v2 = vT * vT - vV * vV - 1e-9;
	const horizVelFps = v2 > 0 ? Math.sqrt(v2) : 0;
	return horizVelFps;
}
