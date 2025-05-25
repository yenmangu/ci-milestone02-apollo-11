import { TelemetryKeys } from '../../types/uiTypes.js';
import { InstrumentsView } from './instrumentView.js';

export class InstrumentsController {
	/**
	 *
	 * @param {import("../../types/uiTypes.js").Instruments} instruments
	 */

	constructor(instruments) {
		this.instrumentsView = new InstrumentsView(instruments);
		this.instruments = instruments;
		this.telemetry = {};
	}

	setUnits(altitude_units) {
		this.instrumentsView.setUnits(altitude_units);
	}

	updateInstruments(valueObject) {
		for (const [key, value] of Object.entries(valueObject)) {
			/**
			 * @type {string}
			 */
			const writableValue = typeof value === 'string' ? value : value.toString();
			this.telemetry[key] = writableValue;
			if (key !== TelemetryKeys.altitudeUnits) {
				const formattedString = ` ${writableValue}`;
				this.instrumentsView.write(key, formattedString);
			} else {
				this.instrumentsView.setUnits(writableValue);
			}
		}
		console.log('Telemetry: ', this.telemetry);
	}

	updateVelocity(value) {
		this.instrumentsView.write('velocity', value);
	}

	updateAltitude(value) {
		this.instrumentsView.write('altitude', value);
	}

	updateFuel(value) {
		this.instrumentsView.write('fuel', value);
	}
}
