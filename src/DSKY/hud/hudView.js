export class HudView {
	/**
	 *
	 * @param {import("../../types/uiTypes.js").HudMap} hudMap
	 */
	constructor(hudMap) {
		/**
		 * @type {import("../../types/uiTypes.js").HudMap}
		 */
		this.hudMap = hudMap;
		this.telemetry = {};
		this.units = '';
	}

	/**
	 *
	 * @param {string} instrument
	 * @param {string} value
	 */
	write(instrument, value) {
		this.telemetry[instrument] = value;
		const formattedString = `: ${value}`;
		this.hudMap[instrument].innerText = value;
	}

	writeTime(value) {
		this.hudMap.get_stamp.innerText = value;
	}

	updateTranscript(value) {
		this.hudMap.transcript.innerText = value;
	}

	setUnits(altitude_units) {
		this.units = altitude_units;
		this.hudMap.altitude_units.innerText = this.units;
	}

	setPhase(phase) {
		this.hudMap.phase_name.innerText = phase;
	}
}
