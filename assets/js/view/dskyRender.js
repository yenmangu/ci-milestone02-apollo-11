import { cast } from '../util/cast.js';
import { pushButtonEmitter, indicatorLightsEmitter } from '../event/eventBus.js';
import {} from '../util/types.js';

/**
 * View class for the DSKY component
 */
export class DskyRender {
	constructor() {
		this.cacheElements();
		this.testLights();
	}

	cacheElements() {
		/** @type {{[key:string]: HTMLElement}} */
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

		console.log('DisplayMap: ', this.displayMap);
		console.log('lightsMap: ', this.indicatorLightsMap);
		console.log(Array.from(Object.entries(this.indicatorLightsMap)));

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
		const dskySection = document.getElementById('dsky');
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
		console.log('Buttons: ', buttons);
		buttons.forEach(btn => {
			const btnEl = cast(btn);
			const light = document.getElementById(btnEl.dataset.dev);
			if (light) {
				btn.addEventListener('click', e => {
					e.preventDefault();
					light.classList.toggle('active');
					btn.classList.toggle('pressed');
				});
			}
			console.log('light: ', light);
		});
	}
}

/**
 * END CLASS
 */

// export function setDskyStateZero() {
// 	/** @type {NodeListOf<HTMLElement>} */
// 	const segmentDisplays = document.querySelectorAll('.seven-segment span[id]');
// 	segmentDisplays.forEach((display, key) => {
// 		display.textContent = key === 0 || key === 1 || key === 2 ? '' : '00000';
// 	});
// }
