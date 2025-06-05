import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { AppStateKeys } from '../../types/missionTypes.js';
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

		this.onAllCompleted = () => {
			if (this.controller.ignition) {
				this.game.fsm.transitionTo(AppStateKeys.braking_phase);
			} else {
				console.warn('Mismatch between allCompleted and ignition status');
			}
		};
		this.prevTelemetry = undefined;
	}

	onEnter() {
		this.controller.onEnter();
		this.watchUntilComplete(
			event => {
				this.handleActionEvent(event);
			},
			complete => {}
		);
		this.prevTelemetry = this.previousTelemetry || null;
		this.controller.updateDisplay();
	}
	async handleActionEvent(event) {
		const { name, data } = event;

		if (name === 'cue_2') {
			this.controller.goForBrakingPhase();
		}

		if (name === 'VERB_37_NOUN_63') {
		}

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
			// Confirm engine ignition

			await this.controller.ignite();

			// @ T-35s - DSKY Blanks for 5 s
			// @T5
			// Show current VELOCITY in R_1
			// Show TIG (min/sec) in R_2
			// Show dV in R_3
			// Failure state - 5 seconds to accept BEFORE Time of Ignition
			// IF keyboard state does not equal proceed!!
			// IF NOT FAIL -
		}
	}

	onTickUpdate() {
		const currentTelemetry = this.getTelemetrySnapshot();
		if (this.previousTelemetry && currentTelemetry) {
			if (this.lastTickPayload !== null) {
				this.controller.handleTick(this.lastTickPayload);
			}
		}
	}

	exit() {
		console.log('Exiting PoweredDescent state');
	}
	handleInput() {
		console.log('Input in PoweredDescent detected');
	}
}
