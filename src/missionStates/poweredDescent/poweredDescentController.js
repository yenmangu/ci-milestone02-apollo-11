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
		await this.introModal();
	}

	async goForPreIgnition() {
		await this.preProgramModal();
		this.dsky.unlock();
	}

	async getProceed() {
		// Await PRO from input (MAX 5 S)
	}

	async ignite() {
		await this.modal.waitForNextClick(false);
		this.ignition = true;
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
		this.gameController.pause();
		await this.modal.waitForNextClick(
			true,

			'Next',
			...this.getModalLines('intro')
		);

		this.gameController.resume();
	}

	async preProgramModal() {
		this.gameController.pause();
		await this.modal.waitForNextClick(
			true,
			'Start Pre-Ignition',
			...this.getModalLines('pre_63')
		);
		this.gameController.resume();
	}

	async preIgnitionModal(section) {
		this.gameController.pause();
		await this.modal.waitForNextClick(true, '');
		this.gameController.resume();
	}
}
