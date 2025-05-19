/**
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 * @typedef {import('../game/gameController.js').GameController} GameController
 * @typedef {import('src/types/missionTypes.js').AppStatesKeys} StateKey
 */
export class MissionState {
	/**
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

	/**
	 * Called by FSM when state becomes active.
	 * Fetches the JSON phase and delegates to onEnter.
	 */
	enter() {
		// Common boilerplate
		const phase = this.game.timeLine.getPhase(this.stateKey);
		this.onEnter(phase);
	}

	/**
	 *
	 * @param {MissionPhase} phase
	 * 	JSON data for this phase or undefined if missing.
	 */
	onEnter(phase) {
		// Default does nothing - subclass override this
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
