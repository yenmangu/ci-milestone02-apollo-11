export class MissionClock {
	constructor(startEpochMs, timeScale = 1) {
		this.startEpoch = startEpochMs;
		this.simStart = performance.now();
		this.elapsedStart = 0;
		this.timeScale = timeScale;
	}

	get secondsElapsed() {
		const now = performance.now();
		return this.elapsedStart + ((now - this.simStart) / 1000) * this.timeScale;
	}

	get missionDate() {
		return new Date(this.startEpoch + this.secondsElapsed * 1000);
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

	pause() {
		this.elapsedStart = this.secondsElapsed;
		this.simStart = null;
	}

	resume() {
		this.simStart = performance.now();
	}
}
