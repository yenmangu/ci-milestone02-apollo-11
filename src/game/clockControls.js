/**
 * @typedef {import('./missionClock.js').MissionClock} MissionClock
 * @typedef {import('../fsm/phaseFSM.js').PhaseFSM} FSM
 * @typedef {import('../types/runtimeTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('../types/runtimeTypes.js').PhaseRange} PhaseRange
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 */

import { PhaseIds } from '../types/timelineTypes.js';
import { getFromSeconds, secondsFromGet } from '../util/GET.js';
import { buildPhaseRanges } from '../util/phaseRanges.js';

export class ClockControls {
	/**
	 *
	 * @param {MissionClock} missionClock
	 * @param {FSM} fsm
	 * @param {MissionTimeline} timeline
	 */
	constructor(missionClock, fsm, timeline) {
		/** @type {MissionClock} */ this.clock = missionClock;
		/** @type {FSM} */ this.fsm = fsm;
		/** @type {MissionTimeline} */ this.timeline = timeline;
		/** @type {PhaseRange[]} */ this.phaseRanges = buildPhaseRanges(
			timeline.runtimePhases
		);
	}

	/**
	 *
	 * @param {string} targetGet
	 */
	handleFastForward(targetGet) {
		const targetSeconds = secondsFromGet(targetGet);
		const currentSeconds = this.clock.currentGETSeconds;

		if (targetSeconds < currentSeconds) {
			console.warn('[ClockControls] Cannot fast forward backwards');
			return;
		}

		this.lastComputedJumpSeconds = targetSeconds;

		const phaseId = this.findPhaseFromGetSeconds(this.lastComputedJumpSeconds);
		if (!Object.values(PhaseIds).includes(phaseId)) {
			console.warn(`[ClockControls] Unknown or invalid phase for GET ${targetGet}`);
			return;
		}

		this.fsm.transitionTo(phaseId);

		for (let s = currentSeconds + 1; s <= targetSeconds; s++) {
			const fakeGet = getFromSeconds(s);
			/** @type {TickPayload} */ const tickPayload = {
				getString: fakeGet,
				getSeconds: s,
				elapsedSeconds: this.clock.elapsedMissionTime
			};
			this.clock.emitTicks(tickPayload);
		}
		this.clock.jumpToTES(this.lastComputedJumpSeconds);
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
}
