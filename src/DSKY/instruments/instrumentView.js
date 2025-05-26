export class InstrumentsView {
	/**
	 *
	 * @param {import("../../types/uiTypes.js").instrumentsMap} instrumentsMap
	 */
	constructor(instrumentsMap) {
		/**
		 * @type {import("../../types/uiTypes.js").instrumentsMap}
		 */
		this.instrumentsMap = instrumentsMap;
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
		this.instrumentsMap[instrument].innerText = value;
	}

	setUnits(altitude_units) {
		this.units = altitude_units;
	}
}
