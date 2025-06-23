export function formatSecondsToHHMMSS(seconds) {
	const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
	const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
	const ss = String(seconds % 60).padStart(2, '0');
	return `${hh}${mm}${ss}`;
}
