export class MissionState {
	/**
	 * @typedef {import('../controller/gameController.js').GameController} GameController
	 * @typedef {import('src/types/missionTypes.js').AppStatesKeys} StateKey
	 * @param {GameController} gameController
	 * @param {StateKey} stateKey
	 */
	constructor(gameController, stateKey) {
		/**@type {GameController} */ this.game = gameController;
		/** @type {StateKey} */ this.stateKey = stateKey;

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

	/**
	 *
	 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
	 * @throws {Error} If not implemented by subclass
	 */
	update(deltaTime) {
		if (this.isPaused) {
			return;
		}
		throw new Error('subclass must implement update()');
	}

	handleInput(input) {}
}
