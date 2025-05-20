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
export class DisplayRender {
	constructor(segmentDisplayMap, lightsMap) {
		this.segmentDisplayMap = segmentDisplayMap;
		this.lightsMap = lightsMap;
		this.cacheElements();
		this.devLightsSub = devLightsEmitter.subscribe(event => {});
		this.testLights();
	}

	cacheElements() {
		/** @type {import('../../types/dskyTypes.js').displayMap} */
		this.displayMap = Array.from(
			document.querySelectorAll('.seven-segment span[id]')
		).reduce((map, element) => {
			map[element.id] = cast(element);
			return map;
		}, {});

		/** @type {{[key:string]: HTMLElement}} */
		this.indicatorLightsMap = Array.from(
			document.querySelectorAll('.indicator-lights .light')
		).reduce((map, element) => {
			map[element.id] = cast(element);
			return map;
		}, {});

		// console.log('DisplayMap: ', this.displayMap);
		// console.log('lightsMap: ', this.indicatorLightsMap);
		// console.log(Array.from(Object.entries(this.indicatorLightsMap)));

		/** @type {HTMLButtonElement[]} */
		this.buttons = Array.from(document.querySelectorAll('.push-button'));
	}

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

	/**
	 * Flash an indicator light or button
	 * @param {string} id
	 */
	setLightViaEvent(id) {
		console.log('setLightViaEvent invoked with: ', id);
		const lightEl = Object.entries(this.indicatorLightsMap).find(
			light => light[1].id === id
		);
		if (lightEl) {
			lightEl[1].classList.toggle('active');
		}
	}

	/**
	 * Show error
	 */

	testLights() {
		/** @type {HTMLElement[]} */
		let buttonArray = [];
		Array.from(Object.entries(this.indicatorLightsMap)).forEach((entry, index) => {
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
				devLightsEmitter.emit({ type: 'light', id: btnEl.dataset.dev });
			});
		});
	}
}
