import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { AppStateKeys } from '../../types/missionTypes.js';
import getSecondsFromGET from '../../util/getSecondsFromGet.js';
import { MissionStateBase } from '../missionStateBase.js';
import { PoweredDescentController } from './poweredDescentController.js';

export class PoweredDescentState extends MissionStateBase {
	/**
	 *
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {PoweredDescentController} controller
	 * @param {import('../../types/missionTypes.js').AppStateKey} key
	 */
	constructor(gameController, dskyInterface, controller, key) {
		super(gameController, dskyInterface, key);
		this.controller = controller;
		this.programEntryDeadline = getSecondsFromGET('102:32:34');
		this.failureShown = false;
		this.onAllCompleted = () => {
			if (this.controller.ignition) {
				this.game.fsm.transitionTo(AppStateKeys.braking_phase);
			} else {
				console.warn('Mismatch between allCompleted and ignition status');
			}
		};
		this.prevTelemetry = undefined;
		this.countdownStarted = undefined;
		this.countdownGET = '102:32:19';
		// window.poweredDescent = this; <<<<< HERE HERE HERE HERE HERE
	}

	async onEnter() {
		this.controller.onEnter();
		await this.controller.goForIntro();
		this.watchUntilComplete(
			event => {
				this.handleActionEvent(event);
			},
			complete => {}
		);
		this.watchAgcActionsUntilComplete(event => {
			this.handleActionEvent(event);
		});
		this.prevTelemetry = this.previousTelemetry || null;
		this.controller.updateDisplay();
		this.bindTickHandler();
		if (!this.keypadStateHandler) {
			this.bindKeypadStateHandler();
		}
	}
	async handleActionEvent(event) {
		// console.log('Event: ', event);

		const { name, data } = event;

		if (name === 'cue_2') {
			// console.log('event: ', event);
			setTimeout(async () => {
				await this.controller.goForPreProgram();
				this.runCues = false;
			}, 1000);
			// if (data.shown && data.shown === true) {
			// 	setTimeout(async () => {
			// 		await this.controller.goForPreProgram();
			// 		this.runCues = false;
			// 	}, 1000);
			// }
		}

		if (name === 'VERB_37_NOUN_63') {
			console.log('Event: ', event);

			if (this.checkProgramStatus('P63')) {
				console.log('P63 entered');
				this.controller.preIgnition = true;
				this.runCues = true;
				await this.controller.goForPreIgnition();
				// HERE
				this.dskyInterface.lock();
				await this.controller.startIgnitionCountdown(this.lastTickPayload);

				// this.game.clock.jumpTo(this.countdownGET);

				// await this.controller.startIgnitionCountdown(this.lastTickPayload);
				// if (this.controller.countdownActive) {
				// 	this.game.clock.jumpTo('102:32:19');
				// 	this.dskyInterface.lock();
				// }
			}
		}

		// ITS NOT FIUCKING FLASHING
		if (name === 'PRO') {
			console.log('event: ', event);
			this.markActionComplete(name);
			console.log('PRO ACCEPTED: IGNITION SOON');
		}
	}

	async onTickUpdate() {
		const currentTelemetry = this.getTelemetrySnapshot();
		if (this.previousTelemetry && currentTelemetry) {
			if (this.lastTickPayload !== null) {
				this.controller.handleTick(this.lastTickPayload);
				this.checkTimelineCues(this.lastTickPayload.get);
			}
		}

		if (this.controller.preIgnition && this.controller.countdownActive) {
			this.controller.updateCountdownTimer(this.lastTickPayload);
		}

		// FAILURE STATE

		if (
			!this.actionsCompleted.has('P63') &&
			this.lastTick >= this.programEntryDeadline
		) {
			if (!this.failureShown) {
				console.warn('P63 Not entered before cutoff - triggering failure');
				this.failureShown = true;
				this.controller.onFailure();
			}
		}
		// Pending cues
		if (
			this.actionsCompleted.has('P63') &&
			this.missedCues.length > 0 &&
			!this.replayingCues
		) {
			await this.showAllPendingCues();
		}
		if (this.countdownStarted) {
			this.handleCountdown();
		}
	}

	handleCountdown() {
		this.controller.startIgnitionCountdown(this.lastTickPayload);
	}

	onKeypadUpdate(keypadState) {
		this.checkDSKYStatus(keypadState);
		console.log('Keypad state in poweredDescent: ', this.keypadState);
		this.controller.keypadState = keypadState;
	}

	async waitForProceed() {
		return new Promise((resolve, reject) => {
			// Determine if program 63 initiated
			this.checkProgramStatus('P63');
			if (true) {
				resolve(true);
				return;
			} else {
				reject(false);
				return;
			}
		});
	}

	exit() {
		super.exit();
	}

	onExit() {
		console.log('Exiting poweredDescentState');

		if (this.tickHandler) {
			this.tickEmitter.off('tick', this.tickHandler);
		}
	}
	handleInput() {
		console.log('Input in PoweredDescent detected');
	}
}
