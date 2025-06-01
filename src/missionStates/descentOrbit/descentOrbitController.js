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

	updateRates(diff) {
		this.view.updateTelemetry(diff);
		this.dsky.hud.updateTelemetry(diff);
	}

	updateDisplay(telemetry) {
		this.dsky.hud.updateHud(telemetry);
	}
}
