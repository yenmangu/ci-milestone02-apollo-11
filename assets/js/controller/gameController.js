/**
 * Game loop controller
 * takes a parsed JSON mission timline document
 */
export class GameController {
	/** @type {Object} */
	constructor(timeline) {
		// Core loop properties

		this.isRunning = false;
		this.startTime = null;
		this.elapsedTime = 0;
		this.currentPhaseIndex = 0;

		// Mission data
		this.timeLine = timeline.mission_phases;
		this.failureConditions = timeline.metadata.failure_conditions;

		// UserInput tracking
		this.requiredInputs = [];
		this.receivedInputs = new Set(); // - chosen for the fact each entry is unique

		// Game State
		this.altitude = 0;
		this.fuel = 100;
		this.verticalVelocity = 0;
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
		const realElapsed = (now - this.startTime) / 1000;

		// Check phase transitions

		// Update game state

		// Check failures

		// Request animation frame
		requestAnimationFrame(() => this.gameLoop());
	}
}
