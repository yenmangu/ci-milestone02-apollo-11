import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { IdleView } from './idleView.js';

export class IdleController {
	/**
	 * @param {GameController} gameController
	 * @param {IdleView} view
	 * @param {DSKYInterface} dskyInterface
	 */
	constructor(gameController, dskyInterface, view) {
		this.gameController = gameController;
		this.dsky = dskyInterface;
		this.view = view;
		this.uiElements = document.querySelectorAll('section[id$="-ui"]');
	}

	onEnter() {
		console.log('on idle enter');

		this.view.showElements(this.uiElements);
		return this.view.showPhaseInto();
	}

	async startIntro() {
		await this.view.renderCountdown(3);
	}

	showElements() {
		this.dsky.dskyController.uiElements;
	}
}
