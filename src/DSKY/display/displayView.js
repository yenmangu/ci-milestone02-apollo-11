import { cast } from '../../util/cast.js';
import {
	pushButtonEmitter,
	indicatorLightsEmitter,
	devLightsEmitter
} from '../../event/eventBus.js';
import {} from '../../types/dskyTypes.js';

/**
 * Render class for the DSKY component
 */
export class DisplayView {
	/**
	 *
	 * @param {import('../../types/uiTypes.js').displayMap} displayMap
	 * @param {import('../../types/uiTypes.js').lightsMap} lightsMap
	 */
	constructor(displayMap, lightsMap) {
		console.log('Display view instance created');
		this.displayMap = displayMap;

		/** @type {import('../../types/uiTypes.js').lightsMap} */
		this.lightsMap = lightsMap;

		this.flashingIntervals = {};
		this.devLightsSub = devLightsEmitter.subscribe(event => {
			this.setLightViaEvent(event.id);
		});
		this.testLights();
	}

	setDskyStateZero() {
		console.log('Setting state zero');

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

	// DEV LIGHTS

	/**
	 * Flash an indicator light or button
	 * @param {string} id
	 */
	setLightViaEvent(id) {
		console.log('setLightViaEvent invoked with: ', id);

		const lightEntry = Object.entries(this.lightsMap).find(
			([_, el]) => el.id === id
		);
		const lightEl = lightEntry[1];
		if (this.flashingIntervals[id]) {
			clearInterval(this.flashingIntervals[id]);
			delete this.flashingIntervals[id];
			lightEl.classList.remove('active');
		} else {
			this.flashingIntervals[id] = setInterval(() => {
				lightEl.classList.toggle('active');
			}, 200);
		}
	}

	/**
	 * Show error
	 */

	testLights() {
		/** @type {HTMLElement[]} */
		let buttonArray = [];
		Object.entries(this.lightsMap).forEach((entry, index) => {
			const button = document.createElement('button');
			button.innerText = entry[0];
			button.setAttribute('data-dev', entry[0]);
			button.setAttribute('id', `btn_light_${index}`);
			button.style.margin = '5px';
			button.classList.add('btn', 'btn-primary');
			buttonArray.push(button);
		});
		const dskySection = document.getElementById('dsky-ui');
		const buttonDiv = document.createElement('div');
		buttonDiv.style.display = 'flex';
		buttonDiv.style.flexDirection = 'row';
		buttonDiv.style.flexWrap = 'wrap';
		buttonArray.forEach(el => {
			buttonDiv.appendChild(el);
		});
		dskySection.parentElement.appendChild(buttonDiv);

		const buttonId = 'btn_light_';
		const buttons = document.querySelectorAll(`[id^=${buttonId}]`);

		buttons.forEach(btn => {
			const btnEl = cast(btn);
			btn.addEventListener('click', e => {
				e.preventDefault();
				console.log('Single click');
				devLightsEmitter.emit({ type: 'light', id: btnEl.dataset.dev });
			});
		});
	}

	destroy() {
		if (this.devLightsSub) {
			this.devLightsSub.unsubscribe();
		}
	}
}
