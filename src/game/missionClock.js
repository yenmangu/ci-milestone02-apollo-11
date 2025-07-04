/**
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 */

import { tickEmitter, runningEmitter } from '../event/eventBus.js';
import { secondsFromGet } from '../util/GET.js';

export class MissionClock {
	constructor(startEpochMs, timeScale = 1, startGetSeconds = 0) {
		this._loop = this._loop.bind(this);
		this.startEpoch = startEpochMs;
		this.lastRealTime = null; // Last real timestamp
		this.elapsedMissionTime = 0; // Accumulated mission time so far
		this.timeScale = timeScale;
		this.startGetSeconds = startGetSeconds;
		this.isRunning = false;
		this.frame = null;
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
		if (!this.isRunning) {
			runningEmitter.emit('running', false);
			return;
		}

		if (this.lastRealTime === null) {
			this.lastRealTime = now;
		} else {
			const realDelta = this.getRealDelta(now);
			this.elapsedMissionTime += realDelta * this.timeScale;
			this.lastRealTime = now;
		}

		// const now = performance.now();
		// const realDelta = this.getRealDelta(now);

		/** @type {TickPayload} */
		const tick = {
			elapsed: this.elapsedMissionTime,
			get: this.currentGETSeconds,
			getFormatted: this.currentGET
		};
		runningEmitter.emit('running', true);
		tickEmitter.emit('tick', tick);
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

		this.lastRealTime = performance.now();
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
	 * @param {*} targetElapsedSeconds
	 */
	jumpToTES(targetElapsedSeconds) {
		if (this.isRunning) {
			const now = performance.now();
			const realDelta = this.getRealDelta(now);
			this.elapsedMissionTime += realDelta * this.timeScale;
			this.isRunning = false;
			this.lastRealTime = null;
			if (this.frame) {
				cancelAnimationFrame(this.frame);
				this.frame = null;
			}
		}

		this.elapsedMissionTime = targetElapsedSeconds;

		this.lastRealTime = performance.now();
		this.isRunning = true;
		requestAnimationFrame(this._loop);

		// No longer needed:
		// const payload = {
		// 	elapsed: this.elapsedMissionTime,
		// 	get: this.currentGETSeconds,
		// 	getFormatted: this.currentGET
		// };
		// tickEmitter.emit('tick', payload);
	}

	// For Debugging purposes
	step(deltaSeconds, emit = true) {
		if (this.isRunning) {
			throw new Error('Cannot step while clock is running');
		}

		this.elapsedMissionTime += deltaSeconds;

		if (emit) {
			tickEmitter.emit('tick', this.elapsedMissionTime);
		}
	}
}
