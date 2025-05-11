export function renderResponseData(responseData) {
	const errorMessage = 'no response data';
	const responseDiv = document.getElementById('response');
	if (responseDiv) {
		responseDiv
			? (responseDiv.innerText = `Remote API response: ${responseData}`)
			: '';
		if (responseDiv.parentElement) {
			const moduleTestDiv = document.createElement('div');
			moduleTestDiv.innerText = 'Modules working and this div has been inserted';
			responseDiv.appendChild(moduleTestDiv);
		}
	}
}

export function testDskyPushButtons() {
	/** @type {NodeListOf<HTMLElement>} */
	const buttons = document.querySelectorAll('button.push-button');
	buttons.forEach(button => {
		button.addEventListener('click', e => {
			e.preventDefault();
			const dskyData = button.dataset.dsky;
			console.log(`Button pressed: ${dskyData}`);
		});
	});
}

export function setDskyStateZero() {
	/** @type {NodeListOf<HTMLElement>} */
	const segmentDisplays = document.querySelectorAll('.seven-segment');
	segmentDisplays.forEach((display, key) => {
		display.textContent = key === 0 || key === 1 || key === 2 ? '00' : '00000';
	});
}
