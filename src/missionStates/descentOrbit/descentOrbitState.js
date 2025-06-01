import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { actionEmitter } from '../../event/eventBus.js';
import { GameController } from '../../game/gameController.js';
import { AppStateKeys } from '../../types/missionTypes.js';
import { MissionStateBase } from '../missionStateBase.js';
import { DescentOrbitController } from './descentOrbitController.js';

/**
 * Descent Orbit state requires one user input: initiate_burn.
 * When burn has completed, then we mark as complete using the markAsComplete()
 */
export class DescentOrbitState extends MissionStateBase {
	/**
	 *
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {DescentOrbitController} stateController
	 * @param {import('../../types/missionTypes.js').AppStateKey} key
	 */
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.controller = stateController;

		this.fuel = undefined;
		this.altitude = undefined;
		this.prevTelemetry = null;
		this.burnInitiated = false;
	}

	// Defining the callback needed for the handleActionEvent

	onEnter() {
		console.log('Sub class required actions: ', this.requiredActions);
		this.watchUntilComplete(
			event => {
				console.log('tracing event: ', event);
				this.handleActionEvent(event);
			},
			event => {
				console.log('Descent Orbit actions completed');
				this.game.fsm.transitionTo(AppStateKeys.powered_descent);
			}
		);

		this.controller.view.enableUserInput();

		this.prevTelemetry = this.previousTelemetry || null;
		this.controller.updateDisplay(this.prevTelemetry);
		this.controller.updatePhase(this.getTelemetrySnapshot().phase_name);
		this.bindTickHandler();
		this.bindKeypadStateHandler();
	}

	onTickUpdate(deltaTimeMs) {
		if (!this.prevTelemetry) {
			return;
		}

		const deltaTime = deltaTimeMs / 1000;

		const currentTelemetry = this.getTelemetrySnapshot();

		if (!currentTelemetry) {
			return;
		}

		const altitudeDelta =
			currentTelemetry.lunar_altitude - this.prevTelemetry.lunar_altitude;
		const altitudeRate = altitudeDelta / deltaTime;

		const velocityDelta =
			currentTelemetry.velocity_fps - this.prevTelemetry.velocity_fps;
		const velocityRate = velocityDelta / deltaTime;

		const fuelDelta =
			currentTelemetry.fuel_percent - this.prevTelemetry.fuel_percent;
		const fuelRate = fuelDelta / deltaTime;

		this.altitudeRate = altitudeRate;
		this.velocityRate = velocityRate;
		this.fuelRate = fuelRate;

		this.prevTelemetry = currentTelemetry;

		this.controller.updateRates({ altitudeDelta, velocityDelta, fuelDelta });
		const currentGETSeconds = this.lastTick;
		this.checkTimelineCues(currentGETSeconds);
	}

	onKeypadUpdate(keypadState) {
		this.checkDSKYStatus(keypadState);
	}

	computeDescent(deltaTime) {
		throw new Error('Method not implemented.');
	}
	computeFuelBurn(deltaTime) {
		throw new Error('Method not implemented.');
	}

	handleActionEvent(event) {
		console.log('Event being handled: ', event);
		if (!event.action) {
			return;
		}
		if (this.requiredActions.has(event.action)) {
			if (event.action === 'verify_burn') this.markActionComplete(event.action);
		}
	}

	exit() {
		super.exit();
		console.log('Exiting DescentOrbit state');
	}
	handleInput() {
		console.log('Input in DescentOrbit detected');
	}
}
