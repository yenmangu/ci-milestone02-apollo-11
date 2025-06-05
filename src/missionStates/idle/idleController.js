import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { actionEmitter } from '../../event/eventBus.js';
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
		this.actionEmitter = actionEmitter;
		this.uiElements = document.querySelectorAll('section[id$="-ui"]');
		this.view.addEventListener('phaseIntroComplete', () => {
			this.actionEmitter.emit('actionsComplete', 'complete');
		});
	}

	onEnter() {
		// console.log('on idle enter');

		this.view.showElements(this.uiElements);
		// return this.view.showPhaseIntro();
	}

	updateDisplay(telemetry) {
		this.dsky.hud.updateHud(telemetry);
	}

	async startIntro() {
		await this.view.renderCountdown(3);
	}

	showElements() {
		this.dsky.dskyController.uiElements;
	}
}
