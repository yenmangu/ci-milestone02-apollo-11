/**
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 */

import { tickEmitter, runningEmitter } from '../event/eventBus.js';
import { secondsFromGet } from '../util/GET.js';

export class MissionClock {
	constructor(startEpochMs, timeScale = 1, startGetSeconds = 0, devMode = false) {
		this._loop = this._loop.bind(this);
		this.startEpoch = startEpochMs;
		this.lastRealTime = null; // Last real timestamp
		this.elapsedMissionTime = 0; // Accumulated mission time so far
		this.timeScale = timeScale;
		this.startGetSeconds = startGetSeconds;
		this.isRunning = false;
		this.frame = null;
		this.tickEmitter = tickEmitter;
		this.devMode = devMode;
	}

	/**
	 *
	 * @param {TickPayload} tickPayload
	 */
	emitTicks(tickPayload) {
		this.tickEmitter.emit('tick', tickPayload);
	}

	get secondsElapsed() {
		if (!this.isRunning || this.lastRealTime === null) {
			return this.elapsedMissionTime;
		}

		const now = performance.now();
		const realDelta = this.getRealDelta(now);
		return this.elapsedMissionTime + realDelta * this.timeScale;
	}

	/**
	 * startGETSeconds + secondsElapsed
	 */
	get currentGETSeconds() {
		// console.log('[DEBUG CLOCK] startGetSeconds:', this.startGetSeconds);
		// console.log('[DEBUG CLOCK] secondsElapsed:', this.secondsElapsed);
		return this.startGetSeconds + this.secondsElapsed;
	}

	get currentGET() {
		const total = this.currentGETSeconds;
		const hh = String(Math.floor(total / 3600)).padStart(2, '0');
		const mm = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
		const ss = String(Math.floor(total % 60)).padStart(2, '0');
		return `${hh}:${mm}:${ss}`;
	}

	get missionDate() {
		return new Date(this.startEpoch + this.secondsElapsed * 1000);
	}

	getRealDelta(now) {
		// console.log('[DEBUG CLOCK] this.lastRealTime', this.lastRealTime);

		return (now - this.lastRealTime) / 1000;
	}

	format() {
		const s = this.secondsElapsed;
		const sign = s < 0 ? '-' : '+';
		const abs = Math.abs(s);
		const hh = String(Math.floor(abs / 3600)).padStart(2, '0');
		const mm = String(Math.floor((abs % 3600) / 60)).padStart(2, '0');
		const ss = String(Math.floor(abs % 60)).padStart(2, '0');
		return `T${sign}${hh}:${mm}:${ss}`;
	}

	_loop(now) {
		// console.log('[Clock Tick]', {
		// 	devMode: this.devMode,
		// 	isRunning: this.isRunning,
		// 	deltaUsed: this.devMode ? '1/60' : 'realDelta'
		// });
		if (!this.isRunning) {
			runningEmitter.emit('running', false);
			return;
		}

		if (
			!this.devMode &&
			(this.lastRealTime === null || this.lastRealTime === undefined)
		) {
			this.lastRealTime = now;
			return;
		}

		let deltaSeconds;

		if (this.devMode) {
			deltaSeconds = 1 / 60; // Fixed 60 fps
			const MAX_DEV_DELTA = 0.1;
			deltaSeconds = Math.min(deltaSeconds, MAX_DEV_DELTA);
		} else {
			deltaSeconds = this.getRealDelta(now);
			this.lastRealTime = now;
		}

		if (isNaN(deltaSeconds)) {
			console.warn('[WARN] realDelta is NaN - skipping tick frame');
			return;
		}
		this.elapsedMissionTime += deltaSeconds * this.timeScale;

		/** @type {TickPayload} */
		const tick = {
			elapsedSeconds: this.elapsedMissionTime,
			getSeconds: this.currentGETSeconds,
			getString: this.currentGET
		};
		runningEmitter.emit('running', true);

		// console.log(
		// 	'[DEBUG CLOCK] Emitting tick: getSeconds =',
		// 	this.currentGETSeconds
		// );

		this.emitTicks(tick);
		this.frame = requestAnimationFrame(this._loop);
	}

	setTimeScale(newScale) {
		if (this.isRunning) {
			// Commit progress before time warping
			const now = performance.now();
			const realDelta = this.getRealDelta(now);
			this.elapsedMissionTime += realDelta * this.timeScale;
			this.lastRealTime = now;
		}
		this.timeScale = newScale;
	}

	start() {
		if (this.isRunning) {
			return;
		}
		this.elapsedMissionTime = 0;
		this.isRunning = true;
		this.lastRealTime = null;

		this.lastRealTime = this.devMode ? null : performance.now();
		this.frame = requestAnimationFrame(this._loop);
	}

	pause() {
		if (!this.isRunning) {
			return;
		}
		runningEmitter.emit('running', false);
		console.log('⏸️ [PAUSING]');

		const now = performance.now();
		const realDelta = this.getRealDelta(now);
		this.elapsedMissionTime += realDelta * this.timeScale;

		this.isRunning = false;
		this.lastRealTime = null;

		if (this.frame) {
			cancelAnimationFrame(this.frame);
			this.frame = null;
		}
		return this.isRunning;
	}

	resume() {
		if (this.isRunning) {
			return;
		}
		runningEmitter.emit('running', true);
		console.log('▶️ [RESUMING]');
		this.isRunning = true;
		this.lastRealTime = null;
		this.frame = requestAnimationFrame(this._loop);
	}

	stop() {
		this.pause();
		this.elapsedMissionTime = 0;
	}

	jumpBy(seconds) {
		console.log(`[DEV]: jumping by ${seconds}s`);

		const target = this.currentGETSeconds + seconds;
		const newElapsedTime = target - this.startGetSeconds;

		this.jumpToTES(newElapsedTime);
	}

	jumpTo(targetGET) {
		const targetAbsoluteSeconds = secondsFromGet(targetGET);
		const newElapsedTime = targetAbsoluteSeconds - this.startGetSeconds;
		this.jumpToTES(newElapsedTime);
	}

	/**
	 * Jump the mission clock to that `secondsElapsed === target`.
	 * Emits a fully formed `tick` event so subscribers get expected payload.
	 * @param {number} targetElapsedSeconds
	 */
	jumpToTES(targetElapsedSeconds) {
		if (this.isRunning) {
			if (!this.devMode) {
				const now = performance.now();
				const realDelta = this.getRealDelta(now);
				this.elapsedMissionTime += realDelta * this.timeScale;
			}

			this.isRunning = false;
			this.lastRealTime = null;
			if (this.frame) {
				cancelAnimationFrame(this.frame);
				this.frame = null;
			}
		}

		this.elapsedMissionTime = targetElapsedSeconds;

		/** @type {TickPayload} */ const tickPayload = {
			elapsedSeconds: this.elapsedMissionTime,
			getSeconds: this.currentGETSeconds,
			getString: this.currentGET
		};

		this.emitTicks(tickPayload);

		this.isRunning = true;
		this.lastRealTime = this.devMode ? null : performance.now();
		requestAnimationFrame(this._loop);
	}

	// For Debugging purposes
	step(deltaSeconds, emit = true) {
		if (this.isRunning) {
			throw new Error('Cannot step while clock is running');
		}

		this.elapsedMissionTime += deltaSeconds;

		/** @type {TickPayload} */ const tickPayload = {
			elapsedSeconds: this.elapsedMissionTime,
			getSeconds: 0,
			getString: ''
		};

		if (emit) {
			this.emitTicks(tickPayload);
		}
	}
}
