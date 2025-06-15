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
		this.prevTelemetry = this.previousTelemetry || null;
		this.controller.updateDisplay();
		this.bindTickHandler();
		if (!this.keypadStateHandler) {
			this.bindKeypadStateHandler();
		}
	}
	async handleActionEvent(event) {
		console.log('Event: ', event);

		const { name, data } = event;

		if (name === 'cue_2') {
			if (data.shown === true) {
				setTimeout(async () => {
					await this.controller.goForPreProgram();
				}, 1000);
			}
		}

		if (name === 'VERB_37_NOUN_63') {
			if (this.checkProgramStatus('P63')) {
				console.log('P63 entered');
				this.controller.preIgnition = true;
				await this.controller.goForPreIgnition();
			} else {
				this.runCues = false;
			}
		}
		if (this.controller.preIgnition)
			if (name === 'VERB_06_NOUN_33') {
				this.controller.getTIG(data);
				// Show TIME OF IGNITION
				// Confirm engine ignition
				// @ T-35s - DSKY Blanks for 5 s
				// @ T-5s - ACTION EVENT DISPLAY VERB 99
			}

		if (typeof name === 'string' && name.startsWith('DISPLAY')) {
			// FLASH VERB 99
			await this.controller.getProceed();
			await this.controller.ignite();
		}
	}

	onTickUpdate() {
		const currentTelemetry = this.getTelemetrySnapshot();
		if (this.previousTelemetry && currentTelemetry) {
			if (this.lastTickPayload !== null) {
				this.controller.handleTick(this.lastTickPayload);
				this.checkTimelineCues(this.lastTickPayload.get);
			}
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
	}

	onKeypadUpdate(keypadState) {
		this.checkDSKYStatus(keypadState);
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
