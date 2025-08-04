/**
 * @typedef {import('./missionClock.js').MissionClock} MissionClock
 * @typedef {import('../fsm/phaseFSM.js').PhaseFSM} FSM
 * @typedef {import('../types/runtimeTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('../types/runtimeTypes.js').PhaseRange} PhaseRange
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 */

import { controlsEmitter } from '../event/eventBus.js';
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
	constructor(missionClock, fsm, timeline, dev = false) {
		/** @type {MissionClock} */ this.clock = missionClock;
		/** @type {FSM} */ this.fsm = fsm;
		/** @type {MissionTimeline} */ this.timeline = timeline;
		/** @type {PhaseRange[]} */ this.phaseRanges = buildPhaseRanges(
			timeline.runtimePhases
		);
		this.controlsEmitter = controlsEmitter;
		this.dev = dev;
	}

	init() {
		this.controlsEmitter.on('fastForward', async payload => {
			if (payload.target)
				await this.handleFastForward(payload.target, payload.interval);
		});
	}

	/**
	 *
	 * @param {string} targetGet
	 * @param {number} [interval=20] - Interval set to 20ms ~60x speed by default
	 * @returns {Promise<void>} resolves when fast forward completes
	 */
	handleFastForward(targetGet, interval = 20) {
		return new Promise(resolve => {
			const targetGETSeconds = secondsFromGet(targetGet);
			const targetSeconds = targetGETSeconds - this.clock.startGetSeconds;
			const currentSeconds = this.clock.elapsedMissionTime;

			if (targetSeconds < currentSeconds) {
				console.warn('[ClockControls] Cannot fast forward backwards');
				return;
			}

			this.lastComputedJumpSeconds = targetSeconds;
			let s = currentSeconds + 1;

			this.clock.pause();
			// const interval = 20; // 1 tick every 20ms ~60x speed
			// Clear interval to avoid button spamming
			if (this.fastForwardInterval) clearInterval(this.fastForwardInterval);
			this.fastForwardInterval = setInterval(() => {
				if (s > targetSeconds) {
					clearInterval(this.fastForwardInterval);
					this.clock.jumpToTES(targetSeconds);
					console.log('[DEBUG] elapsedMissionTime:', this.clock.elapsedMissionTime);
					console.log('[DEBUG] currentGETSeconds:', this.clock.currentGETSeconds);
					console.log('[DEBUG] currentGET:', this.clock.currentGET);
					this.clock.resume();
					this.controlsEmitter.emit('ff', false);
					resolve();
				}

				/**
				 *
				 * @type {(s: number) => string}
				 */
				const getFromMissionGet = s =>
					getFromSeconds(this.clock.startGetSeconds + Math.floor(s));

				const fakeGet = getFromMissionGet(s);

				/** @type {TickPayload} */
				const tickPayload = {
					getString: fakeGet,
					getSeconds: parseFloat(s.toFixed(2)),
					elapsedSeconds: s
				};
				// console.log('[CockControls DEBUG]: ', tickPayload);

				this.clock.emitTicks(tickPayload);
				this.controlsEmitter.emit('ff', true);
				s++;
			}, interval);
		});
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
