/**
 * @typedef {import('../../types/telemetryTypes.js').Telemetry}Telemetry
 * @typedef {import('../../types/missionTypes.js').TimelineCueRuntime} CueData
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 */

import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { Modal } from '../../modal/modalView.js';
import { DescentOrbitView } from './descentOrbitView.js';
import { doi } from '../../modal/modalData.js';

export class DescentOrbitController {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {DescentOrbitView} view
	 * @param {import('../missionStateBase.js').MissionPhase} phase
	 */
	constructor(gameController, dskyInterface, view, phase) {
		this.gameController = gameController;
		this.dsky = dskyInterface;
		this.view = view;
		this.phase = phase;
		this.modal = new Modal();
		this.started = false;
		/** @type {number|null} */ this.burnTargetGET = null;
		this.hasInitiatedBurn = false;
		// this.tickHandler
	}

	/**
	 *
	 * @param {TickPayload} tickPayload
	 */
	async handleCueTick(tickPayload) {
		if (this.burnTargetGET === null) {
			return;
		}

		if (this.hasInitiatedBurn) {
			return;
		}

		if (tickPayload.get >= this.burnTargetGET) {
			this.hasInitiatedBurn = true;
			this.burnTargetGET = null;

			this.gameController.clock.pause();
			const lineOne = doi.line_1;
			const lineTwo = doi.line_2;

			await this.modal.waitForNextClick(true, 'Verify', lineOne, lineTwo);

			// NOW SKIP TO CORRECT TIME
			this.gameController.clock.jumpTo('101:36:00');
			this.gameController.clock.resume();
			// INITIATE p63
			this.dsky.writeProgram('P63');
			// Add COMP ACTY LIGHT FLASH
		}
	}

	/**
	 *
	 * @param {Telemetry} prev
	 * @param {Telemetry} current
	 * @param {number} deltaTimeMs
	 */

	handleTelemetryTick(prev, current, deltaTimeMs) {
		const dt = deltaTimeMs / 1000;
		const altitudeDelta = current.lunar_altitude - prev.lunar_altitude;
		const velocityDelta = current.velocity_fps - prev.velocity_fps;
		const fuelDelta = current.fuel_percent - prev.fuel_percent;

		const rates = {
			altitudeRate: altitudeDelta / dt,
			velocityRate: velocityDelta / dt,
			fuelRate: fuelDelta / dt
		};

		// this.dsky.hud.updateTelemetry({
		// 	lunar_altitude: altitudeDelta,
		// 	velocity_fps: velocityDelta,
		// 	fuel_percent: fuelDelta
		// });
	}

	/**
	 *
	 * @param {CueData} cueData
	 */
	handleBurnInitiation(cueData) {
		this.burnTargetGET = cueData.seconds + 3;
		this.hasInitiatedBurn = false;
	}

	updatePhase(phaseName) {
		this.dsky.hud.updatePhase(phaseName);
	}

	updateDisplay(telemetry) {
		this.dsky.hud.updateHud(telemetry);
	}
}
