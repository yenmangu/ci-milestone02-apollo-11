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
		this.view.showElements(this.uiElements);
	}

	showElements() {
		const {} = this.dsky.dskyController.uiElements;
	}
}
