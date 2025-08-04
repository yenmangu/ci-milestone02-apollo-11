/**
 * @typedef {import("../types/runtimeTypes.js").RuntimePhaseState} Telemetry
 * @typedef {import("../types/runtimeTypes.js").Altitude} Altitude
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 */

import { tickEmitter } from '../event/eventBus.js';
import { secondsFromGet } from '../util/GET.js';
import { watchTelemetryAction } from '../util/watchUntilComplete.js';

export class TelemetryController {
	/**
	 *
	 * @param {Telemetry} initialState
	 * @param {Telemetry} endState
	 * @param {(telemetry: Telemetry)=> void} updateDisplay
	 */
	constructor(initialState, endState, updateDisplay) {
		/** @type {Telemetry} */ this.initialState = initialState;
		/** @type {Telemetry} */ this.endState = endState;
		this.updateDisplay = updateDisplay;
		/** @type {Altitude} */ this.initialAlt = initialState.altitude;
		/** @type {Altitude} */ this.endAlt = endState.altitude;
		/** @type {boolean} */ this.shouldInterpolate = false;
		/** @type {number} */ this.durationSec = 0;
		/** @type {number} */ this.interpolationStartGET = null;
		this.tickWatcher = tickEmitter.on('tick', tickPayload => {
			this.handleTick(tickPayload);
		});
		this.telemetryWatcher = null;
	}

	/**
	 *
	 * @param {TickPayload} tickPayload
	 * @returns
	 */
	handleTick(tickPayload) {
		if (!this.shouldInterpolate) return;
		this.interpolateTelemetry(tickPayload);
	}

	/**
	 *
	 * @param {TickPayload} tickPayload
	 */
	interpolateTelemetry(tickPayload) {
		if (!this.shouldInterpolate) return;

		const currentGET = tickPayload.getSeconds;

		const elapsed = currentGET - this.interpolationStartGET;

		// Clamp between 0 and 1
		const t = Math.min(Math.max(elapsed / this.durationSec, 0), 1);

		// Linear interpolation (lerp) helper
		const lerp = (start, end, t) => start * (1 - t) + end * t;

		const newAlt = {
			miles: lerp(this.initialAlt.miles, this.endAlt.miles, t),
			feet: lerp(this.initialAlt.feet, this.endAlt.feet, t)
		};

		const newVelocity = lerp(this.initialState.velocity, this.endState.velocity, t);
		const newFuel = lerp(this.initialState.fuel, this.endState.fuel, t);

		/**
		 * @type {Telemetry}
		 */
		const interpolatedTelemetry = {
			altitude: newAlt,
			velocity: newVelocity,
			fuel: newFuel,
			vUnits: this.initialState.vUnits
		};

		// Call the update display method passed in constructor
		// Not actually required but I like to ensure its used properly
		if (typeof this.updateDisplay === 'function') {
			this.updateDisplay(interpolatedTelemetry);
		}

		if (t >= 1) {
			this.shouldInterpolate = false;
		}
	}

	/**
	 *
	 * @param {() => void} [onTrigger] // optional and probably not needed but added in case
	 */
	watchForTrigger(onTrigger) {
		this.telemetryWatcher = watchTelemetryAction(
			/**
			 * @param {{type: 'start' | 'stop',
			 * durationSec: number,
			 * interpolationStartGET: string | number
			 * }} data
			 */
			data => {
				if (data.type === 'start') {
					this.shouldInterpolate = true;
					// != loose equality checks for undefined as well as null
					if (data.durationSec != null && data.interpolationStartGET != null) {
						this.durationSec = data.durationSec;
						this.interpolationStartGET =
							typeof data.interpolationStartGET === 'string'
								? secondsFromGet(data.interpolationStartGET)
								: data.interpolationStartGET;
					}
				} else if (data.type === 'stop') {
					this.shouldInterpolate = false;
				} else {
					console.warn(`Unknown telemetry action type: ${data.type}`);
				}
				if (onTrigger) onTrigger();
			}
		);
	}

	exit() {
		if (this.telemetryWatcher) {
			this.telemetryWatcher.unsubscribe();
			this.telemetryWatcher = null;
		}
		if (this.tickWatcher) {
			this.tickWatcher.unsubscribe();
			this.tickWatcher = null;
		}
	}
}
