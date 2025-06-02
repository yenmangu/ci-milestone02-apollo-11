import { AppStateKeys } from '../../../src/types/missionTypes.js';
import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import calculateDeltas from '../../util/calculateDeltas.js';
import { MissionStateBase } from '../missionStateBase.js';
import { IdleController } from './idleController.js';
/**
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 */

/**
 * Represents 'IDLE' mission state
 * @extends MissionStateBase
 */
export class IdleState extends MissionStateBase {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {IdleController} stateController
	 * @param {import('src/types/missionTypes.js').AppStateKey} key
	 */
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		/**
		 * @type {IdleController}
		 */
		this.controller = stateController;
		this.key = key;

		this.prevTelemetry = null;
		this.fuel = undefined;
		this.altitude = undefined;

		this.onAllCompleted = async () => {
			await this.openModal();
			this.game.fsm.transitionTo(AppStateKeys.descent_orbit);
		};
	}
	async openModal() {
		const isRunning = this.game.clock.pause();
		await this.modal.waitForNextClick();
		this.game.clock.resume();
	}

	/**
	 * @override
	 * @param {MissionPhase} phase
	 */
	onEnter(phase) {
		this.controller.onEnter();
		// this.requiredActions = ;
		this.actionsCompleted.clear();

		this.bindTickHandler();

		this.prevTelemetry = this.previousTelemetry || null;
		this.controller.updateDisplay(this.getTelemetrySnapshot());
		this.controller.updatePhase(this.getTelemetrySnapshot().phase_name);
	}

	onTickUpdate(deltaTimeSeconds, getFormatted) {
		const currentGETSeconds = this.lastTick;

		this.checkTimelineCues(currentGETSeconds);
	}

	exit() {
		console.log('Exiting idle state');
	}
	handleInput() {
		console.log('Input in IdleState detected');
	}
}
