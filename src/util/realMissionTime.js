export const LIFTOFF_EPOCH = new Date('1969-07-16T13:32:00Z').getTime();

export default function createMissionTimer(timeScale) {
	const simStartRealTime = performance.now();
	const missionElapsedAtSimStart = 0;

	return {
		getMissionTimeSeconds() {
			const realElapsed = (performance.now() - simStartRealTime) / 1000;
			return missionElapsedAtSimStart + realElapsed * timeScale;
		},
		getMissionUTCTime() {
			const missionElapsed = this.getMissionTimeSeconds();
			return new Date(LIFTOFF_EPOCH + missionElapsed * 1000);
		}
	};
}
