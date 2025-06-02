import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { actionEmitter } from '../../event/eventBus.js';
import { GameController } from '../../game/gameController.js';
import { Modal } from '../../modal/modalView.js';
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
		this.modal = new Modal();
	}

	// Defining the callback needed for the handleActionEvent

	onEnter() {
		// console.log('Sub class required actions: ', this.requiredActions);
		// this.checkProgramStatus('P63');
		this.watchUntilComplete(
			event => {
				// console.log('tracing event: ', event);
				this.handleActionEvent(event);
			},
			eventComplete => {
				// console.log('Descent Orbit actions completed');
				this.game.fsm.transitionTo(AppStateKeys.powered_descent);
			}
		);

		this.prevTelemetry = this.previousTelemetry || null;
		console.log('this.previousTelemetry: ', this.previousTelemetry);
		this.controller.updateDisplay(this.prevTelemetry);
		this.controller.updatePhase(this.getTelemetrySnapshot().phase_name);
		this.bindTickHandler();
		if (!this.keypadStateHandler) {
			this.bindKeypadStateHandler();
		}
	}

	onTickUpdate(deltaTimeMs) {
		const currentTelemetry = this.getTelemetrySnapshot();
		if (this.prevTelemetry && currentTelemetry) {
			this.controller.handleTelemetryTick(
				this.prevTelemetry,
				currentTelemetry,
				this.lastTickPayload
			);
		} else {
			this.prevTelemetry = currentTelemetry;
		}

		const currentGETSeconds = this.lastTick;
		this.controller.handleCueTick(this.lastTickPayload);
		this.checkTimelineCues(currentGETSeconds);
	}

	onKeypadUpdate(keypadState) {
		console.trace('Keypad state in descent orbit controller: ', keypadState);

		this.checkDSKYStatus(keypadState);
	}

	handleActionEvent(event) {
		console.log('Event being handled: ', event);

		const { name, data } = event;
		if (name === 'cue_22') {
			this.controller.handleBurnInitiation(data);
		}
		if (name === 'cue_23') {
			this.controller.handleIgnitionCue(data, this.currentPhase);
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
