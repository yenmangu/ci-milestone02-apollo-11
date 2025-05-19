/**
 * @typedef {import("src/types/missionTypes.js").MissionPhase} MissionPhase
 * @param {MissionPhase} phase
 */
export function renderPhaseInfo(phase) {
	// For now we will use the lemAnimation element
	const container = document.getElementById('lemAnimation');
	if (!container) return;

	container.innerHTML = `
		<h2>${phase.phase_name}</h2>
		<p><strong>Description:</strong> ${phase.description}</p>
		<p><strong>Altitude:</strong> ${phase.lunar_altitude} ${phase.altitude_units}</p>
		<p><strong>Velocity:</strong> ${phase.velocity_fps} fps</p>
		<p><strong>Fuel:</strong> ${phase.fuel_percent}%</p>
		<p><strong>Required Action:</strong> ${phase.required_action}</p>
	`;
}
