import { FSM } from '../state/fsm.js';
import { IdleState } from '../mission/states/idle.js';
import { DescentOrbit } from '../mission/states/descentOrbit.js';
import { PoweredDescent } from '../mission/states/poweredDescent.js';
import { BrakingPhase } from '../mission/states/brakingPhase.js';
import { Alarm1202 } from '../mission/states/alarm1202.js';
import { ApproachPhase } from '../mission/states/approachPhase.js';
import { Alarm1201 } from '../mission/states/alarm1201.js';
import { FinalDescent } from '../mission/states/finalDescent.js';
import { Landed } from '../mission/states/landed.js';
import { Failed } from '../mission/states/failed.js';
import { Paused } from '../mission/states/paused.js';

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
		console.log('GameController created');
		this.fsm = new FSM(this);
		this.fsm.addState('IDLE', IdleState);
		this.fsm.addState('DESCENT_ORBIT', DescentOrbit);
		this.fsm.addState('POWERED_DESCENT', PoweredDescent);
		this.fsm.addState('BRAKING_PHASE', BrakingPhase);
		this.fsm.addState('PROG_ALARM_1202', Alarm1202);
		this.fsm.addState('APPROACH_PHASE', ApproachPhase);
		this.fsm.addState('PROG_ALARM_1201', Alarm1201);
		this.fsm.addState('FINAL_DESCENT', FinalDescent);
		this.fsm.addState('LANDED', Landed);
		this.fsm.addState('FAILED', Failed);
		this.fsm.addState('PAUSED', Paused);

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
