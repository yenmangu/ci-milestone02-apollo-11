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
		console.log('instrumentsMap: ', instrumentsMap);
	}

	/**
	 *
	 * @param {string} instrument
	 * @param {string} value
	 */
	write(instrument, value) {
		this.telemetry = {};
	}

	setUnits(altitude_units) {}
}
