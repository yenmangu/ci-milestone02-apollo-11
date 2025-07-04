export function secondsFromGet(get) {
	const [hh, mm, ss] = get.split(':').map(Number);
	return hh * 3600 + mm * 60 + ss;
}

export function compareGET(a, b) {
	return secondsFromGet(a) - secondsFromGet(b);
}
