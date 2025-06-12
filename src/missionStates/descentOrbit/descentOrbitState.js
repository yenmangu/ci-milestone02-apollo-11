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
		this.phaseWatch = this.watchPhaseUntilComplete;
		this.fuel = undefined;
		this.altitude = undefined;
		this.prevTelemetry = null;
		this.burnInitiated = false;
		this.modal = new Modal();

		this.onAllCompleted = async () => {
			// await this.controller.poweredDescentIntroModal();
			this.game.fsm.transitionTo(AppStateKeys.powered_descent);
		};
	}

	// Defining the callback needed for the handleActionEvent

	onEnter() {
		console.log('Sub class required actions: ', this.requiredActions);
		// this.controller.updatePhase(this.p)
		// this.checkProgramStatus('P63');
		this.watchUntilComplete(
			event => {
				// console.log('tracing event: ', event);
				this.handleActionEvent(event);
			},
			eventComplete => {
				// console.log('eventComplete: ', eventComplete);
				// // console.log('Descent Orbit actions completed');
				// this.game.fsm.transitionTo(AppStateKeys.powered_descent);
			}
		);

		this.watchPhaseUntilComplete(phaseEvent => {
			const { name } = phaseEvent;
			[...this.requiredActions.keys()].forEach(key => {
				if (name === key) {
					this.markActionComplete(name);
				}
			});
		});

		this.prevTelemetry = this.previousTelemetry || null;
		console.log('this.previousTelemetry: ', this.previousTelemetry);
		this.controller.updateDisplay(this.prevTelemetry);
		this.bindTickHandler();
		if (!this.keypadStateHandler) {
			this.bindKeypadStateHandler();
		}
	}

	onTickUpdate() {
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
		this.controller.dskyFinalised = true;
	}

	handleActionEvent(event) {
		// console.log('Event being handled: ', event);

		const { name, data } = event;
		if (name === 'cue_22') {
			this.controller.handleBurnInitiation(data);
		}
		if (name === 'cue_23') {
			this.controller.handleIgnitionCue(data, this.currentPhase);
		}
	}
	exit() {
		super.exit();
	}
	onExit() {
		console.log('Exiting descentOrbit state');

		if (this.tickHandler) {
			this.tickEmitter.off('tick', this.tickHandler);
			this.tickHandler = null;
		}
	}
	handleInput() {
		console.log('Input in DescentOrbit detected');
	}
}
