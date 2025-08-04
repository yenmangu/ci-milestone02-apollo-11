/**
 * @typedef {import('../types/runtimeTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('../game/missionClock.js').MissionClock} MissionClock
 * @typedef {import('../states/simulationState.js').SimulationState} SimulationState
 * @typedef {import('../fsm/phaseFSM.js').PhaseFSM} PhaseFSM
 * @typedef {import('../states/phases/basePhase.js').BasePhase} BasePhase
 * @typedef {import('../types/runtimeTypes.js').RuntimePhase} RuntimePhase
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 * @typedef {import('../types/uiTypes.js').UIStructure} UIStructure
 * @typedef {import('../ui/uiController.js').UIController} UIController
 */

/**
 * @typedef { PhaseFSM | {transitionTo:() => void}} PartialFSM
 */

/**
 * @typedef {{
 * 		phaseId: string,
 * 		startSeconds: number,
 * 		endSeconds: number
 * }} PhaseRange
 */

import { PhaseIds } from '../types/timelineTypes.js';
import { getFromSeconds, secondsFromGet } from '../util/GET.js';

/**
 * Build a sorted list of phase range times
 * @param {RuntimePhase[]} phases
 * @returns {PhaseRange[]}
 */

function buildPhaseRanges(phases) {
	/** @type {PhaseRange[]} */ const ranges = [];

	for (let i = 0; i < phases.length; i++) {
		const phase = phases[i];
		const next = phases[i + 1];
		const startSeconds = secondsFromGet(phase.startGET);
		const endSeconds = next ? secondsFromGet(next.startGET) : Infinity;

		ranges.push({
			phaseId: phase.phaseId,
			startSeconds,
			endSeconds
		});
	}
	return ranges;
}

export class DevController {
	/**
	 *
	 * @param {SimulationState} simState
	 * @param {PartialFSM} fsm
	 * @param {MissionClock} missionClock
	 * @param {MissionTimeline} timeline
	 * @param {UIStructure | {}} [uiStruct={}]
	 * @param {UIController | {}} [uiController={}]
	 *
	 */

	constructor(
		simState,
		fsm,
		missionClock,
		timeline,
		uiStruct = {},
		uiController = {}
	) {
		/** @type {SimulationState} */ this.simState = simState;
		/** @type {PartialFSM} */ this.fsm = fsm;
		/** @type {MissionClock} */ this.clock = missionClock;
		/** @type {boolean} */ this.enabled = true;
		/** @type {MissionTimeline} */ this.timeline = timeline;
		/** @type {PhaseRange[]} */ this.phaseRanges = buildPhaseRanges(
			timeline.runtimePhases
		);
		/** @type {number} */ this.lastComputedJumpSeconds = 0;
		/** @type {UIStructure | {}} */ this.uiStructure = uiStruct;
		/** @type {UIController | {}} */ this.ui = uiController;
	}

	/**
	 *
	 * @param {string} getString
	 * @returns
	 */

	fastForwardTo(getString) {
		const targetGETSeconds = secondsFromGet(getString);
		const targetSeconds = targetGETSeconds - this.clock.startGetSeconds;
		const currentSeconds = this.clock.elapsedMissionTime;

		if (targetSeconds < currentSeconds) {
			console.warn('[DEV] Cannot fast forward backwards');
			return;
		}

		this.lastComputedJumpSeconds = targetSeconds;
		this.clock.pause();
		const phaseId = this.findPhaseFromGetSeconds(targetGETSeconds);

		if (!Object.values(PhaseIds).includes(phaseId)) {
			console.warn(`[DEV] Unknown or invalid phase for GET ${getString}`);
			return;
		}

		this.fsm.transitionTo(phaseId);

		this.clock.jumpToTES(this.lastComputedJumpSeconds);
		// Fast-forward simulation second by second

		const getSeconds =
			this.clock.startGetSeconds + Math.floor(this.clock.elapsedMissionTime);
		const getStringFinal = getFromSeconds(getSeconds);

		/** @type {TickPayload} */ const tickPayload = {
			getString: getStringFinal,
			getSeconds: getSeconds,
			elapsedSeconds: this.clock.elapsedMissionTime
		};
		this.clock.emitTicks(tickPayload);
		this.clock.resume();
	}

	/**
	 *
	 * @param {string} getString
	 * @returns {string | null} phaseId
	 */
	findPhaseFromGet(getString) {
		const seconds = secondsFromGet(getString);
		this.lastComputedJumpSeconds = seconds;
		return this.findPhaseFromGetSeconds(seconds);
	}

	/**
	 *
	 * @param {number} seconds
	 * @returns {string | null} phaseId
	 */
	findPhaseFromGetSeconds(seconds) {
		for (const range of this.phaseRanges) {
			if (seconds >= range.startSeconds && seconds < range.endSeconds) {
				return range.phaseId;
			}
		}
		return null;
	}

	jumpBySeconds(seconds) {
		this.clock.jumpBy(seconds);
	}

	reset() {
		// Clear all required actions
		// Clear any state memory
		// Transition to
	}
}

export function fastForwardTo(getTimeString) {}
export function rewindTo(getTimeString) {}
export function reset() {}
