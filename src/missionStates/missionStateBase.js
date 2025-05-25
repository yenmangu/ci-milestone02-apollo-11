import { DSKYInterface } from '../DSKY/dskyInterface.js';
import { GameController } from '../game/gameController.js';

/**
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 * @typedef {import('src/types/missionTypes.js').AppStateKey} StateKey
 */

/**
 * Creates the MissionStateBase class,
 * which has the Game Controller, DSKY Interface
 * and the state key in the contructor.
 *
 * Every state class extends this super,
 * which gives every state sub class access to this instance
 * of the Game Controller and DSKY Interface.
 * @class
 */
export class MissionStateBase {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {StateKey} stateKey
	 */
	constructor(gameController, dskyInterface, stateKey) {
		/** @type {GameController} */ this.game = gameController;
		/** @type {DSKYInterface} */ this.dskyInterface = dskyInterface;
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
		if (!this.game.timeLine?.getPhase) {
			console.warn(
				`Skipping enter logic: getPhase not available for state ${this.stateKey}`
			);
		}
		if (!this.stateKey) {
			console.debug('No State Key');
		}
		console.trace('mission state base: ', this.stateKey);

		const phase = this.game.timeLine.getPhase(this.stateKey);
		if (phase) {
			console.log('Phase: ', phase);
		}
		if (!phase) {
			console.log('Non Mission Critical state found');
		} else {
			console.log(`Mission critical phase: ${phase.state} found.`);
			this.onMissionCritical(phase);
		}
		this.onEnter(phase);
	}

	/**
	 *
	 * @param {MissionPhase} phase
	 */
	onMissionCritical(phase) {
		const {
			start_time,
			phase_name,
			description,
			lunar_altitude,
			altitude_units,
			velocity_fps,
			fuel_percent,
			required_action,
			audio_ref,
			dsky_actions
		} = phase;

		this.dskyInterface.instrumentsController.updateInstruments({
			altitude_units,
			lunar_altitude,
			velocity_fps,
			fuel_percent
		});
	}

	/**
	 *
	 * @param {MissionPhase} phase
	 * 	JSON data for this phase or undefined if missing.
	 */
	onEnter(phase) {}

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
