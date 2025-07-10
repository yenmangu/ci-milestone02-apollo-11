import { MissionClock } from '../../game/missionClock.js';
import { tickEmitter } from '../../event/eventBus.js';
import { PhaseFSM } from '../../fsm/phaseFSM.js';

/**
 * @param {PhaseFSM} fsm
 * @param {Object} [options]
 * @param {number} [options.timeScale]
 * @param {number} [options.startGetSeconds]
 * @returns {{
 *   clock: MissionClock,
 *   start: () => void,
 *   pause: () => void,
 *   resume: () => void,
 *   jumpBy: (seconds: number) => void,
 *   jumpTo: (get: string) => void,
 *   dispose: () => void,
 * }}
 */

export function createClockHarness(fsm, options = {}) {
	/** @type {MissionClock} */ const clock = new MissionClock(
		performance.now(),
		options.timeScale ?? 1,
		options.startGetSeconds ?? 0
	);

	const tickHandler = tickPayload => {
		fsm.handleTick(tickPayload);
	};

	tickEmitter.on('tick', tickHandler);

	return {
		clock,
		start: () => clock.start(),
		pause: () => clock.pause(),
		resume: () => clock.resume(),
		jumpBy: s => clock.jumpBy(s),
		jumpTo: get => clock.jumpTo(get),
		dispose: () => {
			clock.stop(), tickEmitter.off('tick', tickHandler);
		}
	};
}
