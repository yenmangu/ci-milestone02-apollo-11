import { cast } from './util/cast.js';
import { pushButtonEmitter } from './event/eventBus.js';

export function setDskyStateZero() {
	/** @type {NodeListOf<HTMLElement>} */
	const segmentDisplays = document.querySelectorAll('.seven-segment span[id]');
	segmentDisplays.forEach((display, key) => {
		display.textContent = key === 0 || key === 1 || key === 2 ? '00' : '00000';
	});
}

/**
 *
 * @param {String} dskyData
 * @param {String} state
 */
export function setButtonState(dskyData, state) {
	const button = document.querySelector(`[data-dsky=${dskyData}]`);
	if (!button) {
		throw new TypeError(`Button ${dskyData} not found`);
	}
	/** @type {HTMLElement} */
	const el = cast(button);
	el.dataset.state = state;
}

// Start dev testing

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
