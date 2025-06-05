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

	async goForBrakingPhase() {
		// console.warn('Method not fully implemented.');
		// Enable DSKY INPUT
		// User should select P63
		// Then -> user select V06N33 -> SHOW

		// Await modal and click
		await this.startBrakingPhase();

		// unlock DSKY
		this.dsky.unlock();
		this.preIgnition = true;
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
	getModalLines() {
		return Object.values(this.modalData);
	}

	async startBrakingPhase() {
		await this.modal.waitForNextClick(
			true,
			'Start Powered Descent Phase',
			...this.getModalLines()
		);
	}
}
