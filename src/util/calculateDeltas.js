export default function calculateDeltas(
	lunarAltitude,
	velocity,
	fuel,
	previousTelemetry
) {
	const lunar_altitude = lunarAltitude - previousTelemetry.lunar_altitude;
	const velocity_fps = velocity - previousTelemetry.velocity_fps;
	const fuelValue = fuel - previousTelemetry.fuel_percent;

	return { lunar_altitude, velocity_fps, fuel_percent: fuelValue };
}
