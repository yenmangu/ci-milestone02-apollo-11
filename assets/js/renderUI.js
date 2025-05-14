import { cast } from './util/cast.js';
import { pushButtonEmitter } from './event/eventBus.js';
import {} from './util/types.js';

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

export function initListeners() {
	pushButtonEmitter.subscribe(e => {
		if ((e.type === 'verb' || e.type === 'noun') && e.action) {
			setButtonState(e.type, e.action);
		}
	});
}

export class RenderUI {
	constructor() {
		this.cacheElements();
		this.initListeners();
	}

	cacheElements() {
		// Seven-segment displays
		this.progDisplay = document.getElementById('prog');
		this.verbDisplay = document.getElementById('verb');
		this.nounDisplay = document.getElementById('noun');
		this.regDisplay_1 = document.getElementById('register_1');
		this.regDisplay_2 = document.getElementById('register_2');
		this.regDisplay_3 = document.getElementById('register_3');
		// Polarity displays
		this.polarityDisplay_1 = document.getElementById('polarity_1');
		this.polarityDisplay_2 = document.getElementById('polarity_2');
		this.polarityDisplay_3 = document.getElementById('polarity_3');
		// Indicator lights
		this.compActivityIndicator = document.getElementById('compActy');
		// add more

		// Push buttons
		const pushButtons = document.querySelectorAll('button.push-button');

		const sevenSegmentArray = [
			this.progDisplay,
			this.verbDisplay,
			this.nounDisplay,
			this.regDisplay_1,
			this.regDisplay_2,
			this.regDisplay_3
		];
		const polarityDisplays = [
			this.polarityDisplay_1,
			this.polarityDisplay_2,
			this.polarityDisplay_3
		];

		try {
			let errors = [];

			sevenSegmentArray.forEach(display => {
				if (!display) {
					errors.push(new Error(`Error: ${display} not found!`));
				}
			});
			polarityDisplays.forEach(display => {
				if (!display) {
					errors.push(new Error(`Error: ${display} not found!`));
				}
			});

			pushButtons.forEach(btn => {
				if (!btn) {
					errors.push(new Error(`Error: ${btn} not found!`));
				}
			});
			if (errors.length > 0) {
				throw errors;
			}
		} catch (error) {
			console.error(`Errors found with display initialisation: `, error);
		}
	}

	initListeners() {
		pushButtonEmitter.subscribe(e => {
			if ((e.type === 'verb' || e.type === 'noun') && e.action) {
				setButtonState(e.type, e.action);
			}
		});
	}

	/**
	 * @param {String} dskyData
	 * @param {String} state
	 */
	setButtonState(dskyData, state) {
		const button = document.querySelector(`[data-dsky=${dskyData}]`);
		if (!button) {
			throw new TypeError(`Button ${dskyData} not found`);
		}
		/** @type {HTMLElement} */
		const el = cast(button);
		el.dataset.state = state;
	}
}
