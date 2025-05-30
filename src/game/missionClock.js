import { tickEmitter } from '../event/eventBus.js';

export class MissionClock {
	constructor(startEpochMs, timeScale = 1) {
		this.startEpoch = startEpochMs;
		this.lastRealTime = null; // Last real timestamp
		this.elapsedMissionTime = 0; // Accumulated mission time so far
		this.timeScale = timeScale;

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

	_loop = () => {
		if (!this.isRunning) {
			return;
		}

		const now = performance.now();
		const realDelta = this.getRealDelta(now);

		this.elapsedMissionTime += realDelta * this.timeScale;
		this.lastRealTime = now;

		tickEmitter.emit('tick', this.elapsedMissionTime);
		this.frame = requestAnimationFrame(this._loop);
	};

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
		this.lastRealTime = performance.now();

		this.isRunning = true;
		this._loop();
	}

	pause() {
		if (!this.isRunning) {
			return;
		}

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

	resume() {
		if (this.isRunning) {
			return;
		}
		this.lastRealTime = performance.now();
		this.isRunning = true;

		this._loop();
	}

	stop() {
		this.pause();
		this.elapsedMissionTime = 0;
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
