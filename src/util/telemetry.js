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
