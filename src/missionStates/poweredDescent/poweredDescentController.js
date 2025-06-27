/**
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 * @typedef {import('../../types/missionTypes.js').GameController} GameController
 * @typedef {DSKYInterface} DSKY
 * @typedef {import('../../types/telemetryTypes.js').Telemetry} Telemetry
 * @typedef {import('../../types/telemetryTypes.js').TelemetryRates} TelemetryRates
 * @typedef {import('../../types/dskyTypes.js').KeypadState} KeypadState
 */

/**
 * @typedef {PoweredDescentView} View
 */

import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { pd_intro } from '../../modal/modalData.js';
import { Modal } from '../../modal/modalView.js';
import { formatSecondsToHHMMSS } from '../../util/formatTime.js';
import getSecondsFromGET from '../../util/getSecondsFromGet.js';
import { PoweredDescentView } from './poweredDescentView.js';
import { agcEmitter, pushButtonEmitter } from '../../event/eventBus.js';
import { ModeTypes } from '../../types/dskyTypes.js';

export class PoweredDescentController {
	/**
	 *
	 * @param {GameController} gameController
	 * @param {DSKY} dskyInterface
	 * @param {View} view
	 */
	constructor(gameController, dskyInterface, view) {
		this.gameController = gameController;
		this.dsky = dskyInterface;
		this.view = view;
		this.modal = new Modal();
		this.modalData = null;
		this.preIgnition = false;
		this.ignition = false;
		this.TIG = undefined;
		this.countdownActive = false;
		this.burnInProgress = false;
		this.agcEmitter = agcEmitter;
		this.pushButtonEmitter = pushButtonEmitter;
		/** @type {KeypadState | null} */ this.keypadState = null;
		/** @type {Telemetry} */ this.initialTelemetry = null;
		/** @type {Telemetry} */ this.targetTelemetry = null;
		/** @type {TelemetryRates}*/ this.burnRates = null;
		this.proceedAccepted = false;
		this.proceedRequested = false;
	}

	onEnter() {
		this.dsky.lock();
		this.modalData = pd_intro;
	}

	/**
	 *
	 * @param {TickPayload} lastTickPayload
	 */
	handleTick(lastTickPayload) {
		// This fires continuously on every tick
		const { get } = lastTickPayload;

		// IF T-35seconds from ingition GET
		// >> DSKY Blanks for 5 seconds
		// >> @ T-5s FLASH V99 , SHOW N62
		// THEN GET PROCEED (state)
		//
		// if(get >= )
	}

	getTIG(data) {
		if (typeof data.description === 'string') {
			this.TIG = getSecondsFromGET(data.description);
		}
	}

	async goForIntro() {
		this.gameController.pause();
		await this.introModal();
		await this.postIntroModal();
		this.gameController.resume();
	}

	async goForPreProgram() {
		this.gameController.pause();

		await this.preProgramModal();
		this.dsky.unlock();
		// this.dsky.hud.displayPrompt('Enter "V37N63E"');
		// this.gameController.clock.jumpTo('');
		this.gameController.resume();
	}

	async goForPreIgnition() {
		this.gameController.pause();
		await this.preIgnitionIntroModal();
		await this.preIgnitionInstructionsModal();
		this.gameController.resume();
		this.dsky.compActy(true);
	}

	/**
	 *
	 * @param {TickPayload} currentTick
	 */
	startIgnitionCountdown(currentTick) {
		// method to get ignition countdown
		this.ignitionStartGET = this.ignitionStartGET ?? getSecondsFromGET('102:33:04');
		this.countdownActive = true;

		this.dsky.bulkWrite({
			verb: '06',
			noun: '62',
			r_1: '000000',
			r_2: '000000',
			r_3: '000000'
		});
	}

	/**
	 *
	 * @param {TickPayload} tick
	 */
	updateCountdownTimer(tick) {
		const currentGET = tick.get;
		const secondsRemaining = Math.max(
			0,
			Math.floor(this.ignitionStartGET - currentGET)
		);
		const countdownString = formatSecondsToHHMMSS(secondsRemaining);
		this.dsky.write('r_1', countdownString);
		this.dsky.write('p_1', '+');
		if (secondsRemaining <= 35 && secondsRemaining >= 30) {
			// flash lights???
			// TURN OFF COMPACTY
			this.dsky.compActy(false);
			this.dsky.bulkWrite({
				verb: '',
				noun: '',
				r_1: '------',
				r_2: '------',
				r_3: '------',
				p_1: '',
				p_2: '',
				p_3: ''
			});
		}

		if (secondsRemaining <= 30) {
			// flash lights???
			this.dsky.bulkWrite({
				noun: '62',
				verb: '06',
				r_1: countdownString,
				p_1: '+',
				r_2: '000000',
				p_2: '',
				r_3: '000000',
				p_3: ''
			});
		}

		this.ullagePrompt = false;

		if (secondsRemaining <= 7.5 && secondsRemaining > 6.5) {
			// start ullage burn
			if (!this.ullagePrompt) {
				this.dsky.hud.displayPrompt('Ullage burn started.');
			}
			// console.log('Ullage started at: T-', secondsRemaining);
		}
		if (secondsRemaining <= 5.5) {
			this.dsky.flash('verb', '99');
			this.proceedRequested = true;
			this.dsky.unlock();
			// Notify state of action being emitted
			// REQUEST PROCEED
			if (this.keypadState.mode === ModeTypes.PRO) {
				this.agcEmitter.emit('action', { data: 'PRO' });
				this.proceedAccepted = true;
				this.dsky.lock();
			}
		}
		if (!this.proceedAccepted && secondsRemaining <= 0) {
			// Failure modal
		}
		if (secondsRemaining <= 0) {
			this.dsky.stopFlash();
			this.countdownActive = false;
			this.burnInProgress = true;
			this.dsky.write('p_1', '-');
		}
	}

	/**
	 *
	 * @param {Telemetry} prev
	 * @param {Telemetry} last
	 * @param {TickPayload} lastTickPayload
	 */
	handleBurn(prev, last, lastTickPayload) {
		if (!this.burnInProgress) {
			return;
		}

		if (this.burnInProgress && this.initialTelemetry === null) {
			this.initialTelemetry = {
				lunar_altitude: prev.lunar_altitude,
				velocity_fps: prev.velocity_fps,
				fuel_percent: prev.fuel_percent,
				altitude_units: prev.altitude_units
			};
		}

		const actualTimeSec = 10;
	}

	async getProceed() {
		// Await PRO from input (MAX 5 S)
	}

	async ignite() {
		await this.modal.waitForNextClick(false);
		this.ignition = true;
	}

	onFailure() {
		this.dsky.hud.displayTranscript('FAILURE');
	}

	updateDisplay() {}

	/**
	 *

	 * @returns {string[]}
	 */
	getModalLines(section) {
		return Object.values(this.modalData[section]);
	}

	async introModal() {
		await this.getModal('intro', 'Next');
	}

	async postIntroModal() {
		await this.getModal('post_intro', 'Next');
	}

	async preProgramModal() {
		await this.getModal('pre_63', 'Go');
	}

	async preBrakingModal() {
		await this.getModal('pre_braking_out', 'Next');
	}

	async preIgnitionIntroModal() {
		await this.getModal('pre_ignition_1', 'Enter Braking');
	}
	async preIgnitionInstructionsModal() {
		await this.getModal('pre_ignition_2', 'Next');
		await this.getModal('pre_ignition_3', 'Next');
		await this.getModal('pre_ignition_final', 'Go');
	}

	async failureModal() {
		await this.modal.failureModal('IGNITION_PROCEED_TIMEOUT');
	}

	async getModal(section, buttonText) {
		const lines = this.getModalLines(section);
		await this.modal.waitForNextClick(true, buttonText, ...lines);
	}
}
