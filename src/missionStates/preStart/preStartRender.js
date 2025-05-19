export function onStart(callback) {
	const startButton = document.getElementById('startBtn');
	if (startButton) {
		startButton.addEventListener('click', e => {
			e.preventDefault();
			callback();
		});
	}
}

export function getUISections() {
	return document.querySelectorAll('section[id$="-ui"]');
}
