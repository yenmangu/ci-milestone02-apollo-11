import { cast } from '../util/cast.js';
import { pushButtonEmitter } from '../event/eventBus.js';
import {} from '../util/types.js';

/**
 * View class for the DSKY component
 */
export class DskyRender {
	constructor() {
		this.cacheElements();
	}

	cacheElements() {
		this.displayMap = Array.from(
			document.querySelectorAll('.seven-segment span[id]')
		).reduce((map, element) => {
			map[element.id] = cast(element);
			return map;
		}, {});

		/** @type {HTMLButtonElement[]} */
		this.buttons = Array.from(document.querySelectorAll('.push-button'));
	}

	onButtonClick(handler) {
		this.buttons.forEach(btn => {
			btn.addEventListener('click', e => {
				e.preventDefault();
				handler(btn.dataset.dsky);
			});
		});
	}

	// initListeners() {
	// 	pushButtonEmitter.subscribe(e => {
	// 		if ((e.type === 'verb' || e.type === 'noun') && e.action) {
	// 			setButtonState(e.type, e.action);
	// 		}
	// 	});
	// }
	/*
	/**
	 * @param {String} dskyData
	 * @param {String} state
	 */
	// setButtonState(dskyData, state) {
	// 	const button = document.querySelector(`[data-dsky=${dskyData}]`);
	// 	if (!button) {
	// 		throw new TypeError(`Button ${dskyData} not found`);
	// 	}
	// 	/** @type {HTMLElement} */
	// 	const el = cast(button);
	// 	el.dataset.state = state;
	// }

	setDskyStateZero() {
		Object.values(this.displayMap).forEach((display, idx) => {
			display.textContent = idx < 3 ? '00' : '00000';
		});
	}

	write(id, value) {
		/** @type {HTMLElement} */
		const el = cast(this.displayMap[id]);
		if (!el) {
			console.warn(`No display for ${id}`);
		}
		el.textContent = value;
	}

	bulkWrite(values) {
		for (let [id, value] of Object.entries(values)) {
			this.write(id, value);
		}
	}

	/**
	 *
	 * @param {string} dskyData
	 * @param {string} state
	 */
	setButtonState(dskyData, state) {
		const btn = this.buttons.find(b => b.dataset.dskyData === dskyData);
		if (btn) {
			btn.dataset.state = state;
		}
	}

	/**
	 * Flash an indicator light or button
	 */

	/**
	 * Show error
	 */
}

/**
 * END CLASS
 */

export function setDskyStateZero() {
	/** @type {NodeListOf<HTMLElement>} */
	const segmentDisplays = document.querySelectorAll('.seven-segment span[id]');
	segmentDisplays.forEach((display, key) => {
		display.textContent = key === 0 || key === 1 || key === 2 ? '' : '00000';
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

export function initListeners() {
	pushButtonEmitter.subscribe(e => {
		if ((e.type === 'verb' || e.type === 'noun') && e.action) {
			setButtonState(e.type, e.action);
		}
	});
}
