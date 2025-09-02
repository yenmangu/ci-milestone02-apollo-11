/**
 *@typedef {import("../util/telemetry.js").RawTelemetry} RawTelemetry
 */

/**
 *
 * @param {RawTelemetry} raw
 */
export function normaliseRaw(raw) {
	const altitudeFeet =
		raw.altitude.feet ??
		(raw.altitude.miles != null ? raw.altitude.miles * 5280 : 0);

	return {
		velocityFps: raw.velocity,
		altitudeFeet,
		fuel: raw.fuel
	};
}

/**
 *
 * @param {{altitudeFeet: number, velocityFps: number, fuel: number}} normalised
 * @returns  {RawTelemetry}
 */
export function normalisedToRaw(normalised) {
	const feet = normalised.altitudeFeet;
	const miles = feet / 5280;
	return {
		altitude: { feet, miles },
		velocity: normalised.velocityFps,
		fuel: normalised.fuel,
		vUnits: 'fps'
	};
}
