import { FSM } from '../FSM/fsm.js';
import getSecondsFromGET from '../util/getSecondsFromGet.js';
import { LIFTOFF_EPOCH } from '../util/realMissionTime.js';
import { MissionClock } from './missionClock.js';

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
	static _dev = false;
	/** @param {MissionTimeline} timeline */
	constructor(timeline) {
		this.fsm = new FSM(this);

		// Core loop properties

		this.isRunning = false;
		this.startTime = null;
		this.elapsedTime = 0;
		this.currentPhaseIndex = 0;
		this.startGetSeconds = getSecondsFromGET(timeline.mission_phases[0].get_stamp);
		this.clock = new MissionClock(
			LIFTOFF_EPOCH,
			timeline.metadata.time_scale || 1,
			this.startGetSeconds
		);
		this.frame = null;
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

	start() {
		// this.clock.on('tick', secondsElapsed => {});
		this.clock.start();
	}

	resume() {
		this.clock.start();
	}
	pause() {
		this.clock.pause();
	}
}
