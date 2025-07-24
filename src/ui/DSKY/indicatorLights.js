/**
 * @typedef {import('../../types/uiTypes.js').IndicatorLights} Lights
 * @typedef {import('../../types/uiTypes.js').IndicatorLightKey} LightKey
 */

import { lightKeys } from '../../types/uiTypes.js';

export class IndicatorLights {
	/**
	 *
	 * @param {Lights} lights
	 */
	constructor(lights) {
		/** @type {Lights} */ this.lights = lights;
		this.lightsInterval = {};
	}

	/**
	 *
	 * @param {LightKey} key
	 */
	setLight(key) {
		if (key === 'compActy') {
			this.lights[key].dataset.dsky = 'active';
		}
		this.lights[key].classList.add('active');
	}

	/**
	 *
	 * @param {LightKey[]} keys
	 */
	setActiveLights(keys) {
		this.clearAll();
		keys.forEach(key => this.setLight(key));
	}

	/**
	 *
	 * @param {LightKey} key
	 * @param {number} interval
	 */
	flashLight(key, interval = 200) {
		if (this.lightsInterval[key]) {
			clearInterval(this.lightsInterval[key]);
			delete this.lightsInterval[key];
		}
		this.lightsInterval[key] = setInterval(() => {
			const el = this.lights[key];
			if (key === 'compActy') {
				el.dataset.dsky = el.dataset.dsky === 'active' ? 'inactive' : 'active';
			}
			this.lights[key].classList.toggle('active');
		}, interval);
	}

	/**
	 *
	 * @param {LightKey} key
	 */
	clearLight(key) {
		if (key === 'compActy') {
			this.lights[key].dataset.dsky = 'inactive';
		}
		this.lights[key].classList.remove('active');
	}

	clearAll() {
		lightKeys.forEach(
			/** @param {LightKey} key */ key => {
				const el = this.lights[key];
				if (!el) {
					console.error('no light found for: ', key);
				}
				if (key === 'compActy') {
					el.dataset.dsky = 'inactive';
				}
				el.classList.remove('active');

				if (this.lightsInterval[key]) {
					this.lights[key].classList.remove('active');
				}
				clearInterval(this.lightsInterval[key]);
				delete this.lightsInterval[key];
			}
		);
	}
}
