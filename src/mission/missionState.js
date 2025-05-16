export class MissionState {
	/**
	 * @typedef {import('../controller/gameController.js').GameController} GameControllerInstance
	 * @param {GameControllerInstance} gameController
	 */
	constructor(gameController) {
		this.game = gameController;
		/**
		 * Single point of truth for pause status.
		 * All child state classes inherit this.
		 * @type {boolean}
		 */
		this.isPaused = false;
	}

	// Abstract Methods all child classes must implement

	enter() {
		throw new Error('Subclass must implement enter()');
	}

	exit() {
		throw new Error('Subclass must implement exit()');
	}

	update(deltaTime) {
		throw new Error('subclass must implement update()');
	}

	handleInput(input) {}
}
