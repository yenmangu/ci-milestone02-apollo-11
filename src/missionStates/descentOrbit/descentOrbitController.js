/**
 * @typedef {import('../../types/telemetryTypes.js').Telemetry | null}Telemetry
 * @typedef {import('../../types/telemetryTypes.js').TelemetryRates | null} TelemetryRates
 * @typedef {import('../../types/missionTypes.js').TimelineCueRuntime} CueData
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 */

import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { Modal } from '../../modal/modalView.js';
import { DescentOrbitView } from './descentOrbitView.js';
import { doi, pd_intro } from '../../modal/modalData.js';
import { phaseEmitter } from '../../event/eventBus.js';

export class DescentOrbitController {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {DescentOrbitView} view
	 */
	constructor(gameController, dskyInterface, view) {
		this.gameController = gameController;
		this.dsky = dskyInterface;
		this.view = view;
		this.modal = new Modal();
		this.started = false;
		this.phaseEmitter = phaseEmitter;
		/** @type {number | null} */ this.burnTargetGET = null;
		/** @type {number | null} */ this.ingitionStartGET = null;
		/** @type {number | null} */ this.burnFinishGET = null;
		/** @type {number} */ this.burnTime = 0;
		/** @type {boolean} */ this.burnInProgress = false;

		this.initiatedPreBurn = false;
		this.ignitionTriggered = false;

		this.normalScale = 1;

		/** @type {Telemetry} */ this.initialTelemetry = null;
		/** @type {Telemetry} */ this.targetTelemetry = null;
		/** @type {TelemetryRates}*/ this.burnRates = null;
		/** @type {() => void} */ this.burnTickUnsub = null;

		this.burnStartRealTime = null;
		this.burnEndRealTime = null;
		this.useDSKYGet = undefined;
		this.dskyFinalised = false;
	}

	// /**
	//  *
	//  * @param {Telemetry} prev
	//  * @param {Telemetry} current
	//  * @param {TickPayload} tick
	//  */
	// handleTick(prev, current, tick) {
	// 	const {get} = tick
	// 	if (get >= this.useDSKYGet) {
	// 		if(!this)
	// 		this.handleDSKYInput()
	// 	}

	// 	if (get >= this.burnTargetGET) {
	// 		this.handleBurnTick()
	// 	}

	// 	if(get >= 1 ){}

	// }
	// handleBurnTick() {

	// }
	// handleDSKYInput() {
	// 	if(!this.dskyFinalised) return
	// 	this.dsky.write()
	// }

	/**
	 *
	 * @param {TickPayload} tickPayload
	 */
	async handleCueTick(tickPayload) {
		if (this.burnTargetGET === null) {
			return;
		}

		if (this.ignitionTriggered) {
			return;
		}

		if (this.initiatedPreBurn) {
			return;
		}

		if (tickPayload.get >= this.burnTargetGET) {
			this.initiatedPreBurn = true;
			this.burnTargetGET = null;

			this.gameController.clock.pause();
			const lineOne = doi.line_1;
			const lineTwo = doi.line_2;

			// OPEN MODAL AND WAIT FOR CLICK
			await this.modal.waitForNextClick(true, 'Verify', lineOne, lineTwo);

			// NOW SKIP TO CORRECT TIME
			this.gameController.clock.jumpTo('101:36:10');
			this.gameController.clock.resume();
			this.phaseEmitter.emit('action', { name: 'verify_burn' });

			// Add COMP ACTY LIGHT FLASH
		}
		// IGNITION ROUTINE
	}

	/**
	 *
	 * @param {Telemetry} prev
	 * @param {Telemetry} current
	 * @param {TickPayload} lastTickPayload
	 */

	handleTelemetryTick(prev, current, lastTickPayload) {
		if (!this.ignitionTriggered) {
			return;
		}

		if (this.burnInProgress && this.initialTelemetry === null) {
			this.initialTelemetry = {
				lunar_altitude: prev.lunar_altitude,
				velocity_fps: prev.velocity_fps,
				fuel_percent: prev.fuel_percent,
				altitude_units: prev.altitude_units
			};
		}

		const actualBurnTimeSec = this.burnFinishGET - this.ingitionStartGET;

		this.burnRates = {
			altitudeRate:
				(this.targetTelemetry.lunar_altitude -
					this.initialTelemetry.lunar_altitude) /
				actualBurnTimeSec,
			velocityRate:
				(this.targetTelemetry.velocity_fps - this.initialTelemetry.velocity_fps) /
				actualBurnTimeSec,
			fuelRate:
				(this.targetTelemetry.fuel_percent - this.initialTelemetry.fuel_percent) /
				actualBurnTimeSec
		};

		if (this.burnInProgress && this.burnRates && this.initialTelemetry != null) {
			const currentGET = lastTickPayload.get;
			// How many sim-seconds we are into the burn
			// (Clamped to as to never exceed total burn duration)
			const elapsedSimTime = Math.min(
				currentGET - this.ingitionStartGET,
				this.burnFinishGET - this.ingitionStartGET
			);

			// Interpolate the values

			const newAlt =
				this.initialTelemetry.lunar_altitude +
				this.burnRates.altitudeRate * elapsedSimTime;

			const newVelocity =
				this.initialTelemetry.lunar_altitude +
				this.burnRates.altitudeRate * elapsedSimTime;

			const newFuel =
				this.initialTelemetry.fuel_percent +
				this.burnRates.fuelRate * elapsedSimTime;

			this.updateDisplay({
				lunar_altitude: newAlt.toFixed(2),
				velocity_fps: newVelocity.toFixed(2),
				fuel_percent: newFuel.toFixed(2)
			});

			if (currentGET >= this.burnFinishGET) {
				this.updateDisplay(this.targetTelemetry);
				this.burnEndRealTime = performance.now();
				const realDurationMs = this.burnEndRealTime - this.burnStartRealTime;
				const realDurationS = realDurationMs / 1000;
				console.log(`Burn wall-clock time: ${realDurationMs.toFixed(1)} ms`);
				console.log(`(≈ ${realDurationS.toFixed(2)} s)`);
				this.gameController.clock.setTimeScale(this.normalScale);
				this.burnInProgress = false;
				this.phaseEmitter.emit('action', { name: 'complete_burn' });
			}
		}
	}

	/**
	 *
	 * @param {Telemetry} prev
	 * @returns
	 */
	handleIgnitionEvent(prev) {
		if (!this.ignitionTriggered) return;
		if (this.burnInProgress && this.initialTelemetry === null) {
			this.initialTelemetry = {
				lunar_altitude: prev.lunar_altitude,
				velocity_fps: prev.velocity_fps,
				fuel_percent: prev.fuel_percent,
				altitude_units: prev.altitude_units
			};
		}
	}

	handleIgnitionCue(cueData, phase) {
		this.ignitionTriggered = true;
		const { meta } = cueData;
		const targetDuration = 10;
		// Duration (29.8s)
		this.burnTime = meta.burn_time;
		this.ingitionStartGET = cueData.seconds;
		this.burnFinishGET = cueData.seconds + this.burnTime;

		this.targetTelemetry = {
			lunar_altitude: phase.lunar_altitude,
			velocity_fps: phase.velocity_fps,
			fuel_percent: phase.fuel_percent,
			altitude_units: phase.altitude_units
		};
		this.normalScale = this.gameController.clock.timeScale;
		this.burnTimeScale = this.normalScale * (this.burnTime / targetDuration);
		this.gameController.clock.setTimeScale(this.burnTimeScale);

		// this.dsky.writeProgram('P63');
		// this.phaseEmitter.emit('action', { name: 'P63' });
		this.burnInProgress = true;
		this.burnStartRealTime = performance.now();
	}

	/**
	 *
	 * @param {CueData} cueData
	 */
	handleBurnInitiation(cueData) {
		this.burnTargetGET = cueData.seconds + 3;

		this.initiatedPreBurn = false;
	}

	updateDisplay(telemetry) {
		this.dsky.hud.updateHud(telemetry);
	}

	async poweredDescentIntroModal() {
		await this.modal.waitForNextClick(
			true,

			'Start Powered Descent Routine',
			...Object.values(pd_intro)
		);
	}
}
