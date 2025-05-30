import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { DescentOrbitView } from './descentOrbitView.js';

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

		this.started = false;
		// this.tickHandler
	}

	updateRates({ altitudeRate, velocityRate, fuelRate }) {
		this.view.updateTelemetry({ altitudeRate, velocityRate, fuelRate });
		this.dsky.hudController.updateTelemetry({
			altitudeRate,
			velocityRate,
			fuelRate
		});
	}

	updateDisplay(deltaTime) {
		throw new Error('Method not implemented.');
	}
}
