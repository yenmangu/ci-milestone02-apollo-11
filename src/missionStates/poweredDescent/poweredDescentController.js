/**
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 * @typedef {import('../../types/missionTypes.js').GameController} GameController
 * @typedef {DSKYInterface} DSKY
 */

/**
 * @typedef {PoweredDescentView} View
 */

import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { pd_intro } from '../../modal/modalData.js';
import { Modal } from '../../modal/modalView.js';
import getSecondsFromGET from '../../util/getSecondsFromGet.js';
import { PoweredDescentView } from './poweredDescentView.js';

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
		this.dsky.hud.displayPrompt('Enter "V37N63E"');
		this.gameController.clock.jumpTo('');
		this.gameController.resume();
	}

	async goForPreIgnition() {
		this.gameController.pause();
		await this.preIgnitionIntroModal();
		await this.preIgnitionInstructionsModal();
		this.gameController.resume();
		// Display correct values
		this.dsky.hud.displayPrompt('Try the following: V37');
		// Test values
		this.dsky.bulkWrite({
			verb: '06',
			noun: '61',
			register_1: '111111',
			register_2: '222222',
			register_3: '333333'
		});
	}

	async getProceed() {
		// Await PRO from input (MAX 5 S)
	}

	async ignite() {
		await this.modal.waitForNextClick(false);
		this.ignition = true;
	}

	onFailure() {
		this.dsky.hud.displayPrompt('FAILURE');
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
		await this.getModal('pre_63', 'Proceed');
	}

	async preIgnitionIntroModal() {
		await this.getModal('pre_ignition_1', 'Enter Pre-Ignition');
	}
	async preIgnitionInstructionsModal() {
		await this.getModal('pre_ignition_2', 'Next');
		await this.getModal('pre_ignition_3', 'Next');
		await this.getModal('pre_ignition_final', 'Next');
	}

	async getModal(section, buttonText) {
		const lines = this.getModalLines(section);
		await this.modal.waitForNextClick(true, buttonText, ...lines);
	}
}
