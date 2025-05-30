export default function getSecondsFromGET(get) {
	const [hh, mm, ss] = get.split(':').map(Number);
	return hh * 3600 + mm * 60 + ss;
}
