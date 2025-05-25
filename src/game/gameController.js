import { FSM } from '../FSM/fsm.js';

/**
 * @typedef {import('src/types/missionTypes.js').MissionTimeline} MissionTimeline
 * @typedef {MissionTimeline['metadata']} Metadata
 * @typedef {MissionTimeline['metadata']['global_failures']} GlobalFailures
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 * @typedef {MissionPhase['failure_state']} FailureState
 */

/**
 * Game loop controller
 * takes a parsed JSON mission timline document
 */
export class GameController {
	/** @param {MissionTimeline} timeline */
	constructor(timeline) {
		console.log('GameController created with timeline: ', timeline);
		this.fsm = new FSM(this);

		// Core loop properties

		this.isRunning = false;
		this.startTime = null;
		this.elapsedTime = 0;
		this.currentPhaseIndex = 0;

		// Mission data

		/** @type {MissionTimeline} */ this.timeLine = timeline;

		/** @type {GlobalFailures} */ this.globalFailureConditions =
			timeline.metadata.global_failures;

		// UserInput tracking
		this.requiredInputs = [];
		this.receivedInputs = new Set(); // - chosen for the fact each entry is unique

		// Game State
		this.altitude = 0;
		this.fuel = 100;
		this.verticalVelocity = 0;
		this.pauseGame = undefined;
		this.resumeGame = undefined;
	}

	// Start time-based game loop

	start() {
		if (this.isRunning) return;
		this.isRunning = true;
		this.startTime = Date.now();
		this.gameLoop();
	}

	gameLoop() {
		if (!this.isRunning) return;

		// Calculate elapsed mission time

		const now = Date.now();
		// Get the current elapsed time since the loop started
		// 'Divide by 1000 in order to convert ms to s'
		const realElapsed = (now - this.startTime) / 1000;

		/**
		 * Apply a time scale factor to accelerate or
		 * decelerate the mission simulation.
		 * Uses time_scale factor from JSON timeline
		 * Fallback to '1' (real time speed) if no time_scale factor
		 */
		this.elapsedTime = realElapsed * (this.timeLine.metadata?.time_scale || 1);

		// PauseFunction
		if (this.pauseGame) {
			while (!this.resumeGame) {
				this.pause();
			}
			this.resume();
		}

		// Check phase transitions
		this.checkPhases();

		// Update game state
		this.updateState();

		// Check failures
		this.checkFailures();

		// Request animation frame
		requestAnimationFrame(() => this.gameLoop());
	}
	resume() {
		throw new Error('Method not implemented.');
	}
	pause() {
		throw new Error('Method not implemented.');
	}
	checkFailures() {
		throw new Error('Method not implemented.');
	}
	updateState() {
		throw new Error('Method not implemented.');
	}
	checkPhases() {
		// Check if game needs to advance to next phase

		throw new Error('Method not implemented.');
	}
}
