import { TelemetryKeys } from '../../types/uiTypes.js';
import { HudView } from './hudView.js';

export class HudController {
	/**
	 *
	 * @param {import("../../types/uiTypes.js").HudElements} instruments
	 */

	constructor(instruments) {
		this.hudView = new HudView(instruments);
		this.instruments = instruments;
		this.telemetry = {};
		console.log('Instruments: ', instruments);
	}

	setUnits(altitude_units) {
		this.hudView.setUnits(altitude_units);
	}

	updateHud(telemetry) {
		for (const [key, value] of Object.entries(telemetry)) {
			/**
			 * @type {string}
			 */
			const writableValue = typeof value === 'string' ? value : value.toString();
			this.telemetry[key] = writableValue;

			if (key === TelemetryKeys.phaseName) {
				this.hudView.setPhase(writableValue);
			}

			if (key !== TelemetryKeys.altitudeUnits) {
				this.hudView.write(key, writableValue);
			} else {
				this.hudView.setUnits(writableValue);
			}
		}
	}
	updateTelemetry(rates) {
		throw new Error('Method not implemented.');
	}

	updateVelocity(value) {
		this.hudView.write('velocity', value);
	}

	updateAltitude(value) {
		this.hudView.write('altitude', value);
	}

	updateFuel(value) {
		this.hudView.write('fuel', value);
	}
	/**
	 * @param {{
	 *  altitude: string,
	 *  velocity: string,
	 *  fuel: string,
	 *  time: string,
	 *  phase: string,
	 * 	altitude_units: string
	 * }} telemetry
	 */
	renderHud(telemetry) {
		this.updateHud({
			lunar_altitude: telemetry.altitude,
			velocity_fps: telemetry.velocity,
			fuel_percent: `${telemetry.fuel}%`,
			start_time: telemetry.time,
			phase_name: telemetry.phase,
			altitudeUnits: telemetry.altitude_units
		});
	}
}
