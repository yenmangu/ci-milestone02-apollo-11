/**
 * @typedef {import("../../types/uiTypes.js").lightsMap} LightsMap
 */

import { indicatorLightsEmitter } from '../../event/eventBus.js';

export class IndicatorLights {
	/**
	 *
	 * @param {LightsMap} lightsMap
	 */
	constructor(lightsMap) {
		this.lightsMap = lightsMap;
		this.lightsEmitter = indicatorLightsEmitter;
		this.flashingIntervals = {};
	}

	subscribeToLightsEvents() {
		this.lightsEmitter.on('on', event => {
			this.handleLightEvent(event);
		});
		this.lightsEmitter.on('off', event => {
			this.handleLightOff(event);
		});
	}
	handleLightOff(event) {
		const { id } = event;
		this.lightOff(id);
	}

	handleLightEvent(event) {
		const { id } = event;
		if (event.flash) {
			const interval = event.interval ? event.interval : undefined;
			this.flashLight(id, interval);
		} else {
		}
	}

	flashLight(id, interval = 200) {
		const light = this.findLight(id);
		if (!light) {
			throw new Error(`Light ${id} not found.`);
		}
		if (this.flashingIntervals[id]) {
			clearInterval(this.flashingIntervals[id]);
			light.classList.remove('active');
		} else {
			this.flashingIntervals[id] = setInterval(() => {
				light.classList.toggle('active');
			}, interval);
		}
	}

	lightOn(id) {
		const light = this.findLight(id);
		if (!light) {
			throw new Error(`Light ${id} not found.`);
		}
		light.classList.add('active');
	}

	lightOff(id) {
		const light = this.findLight(id);
		if (!light) {
			throw new Error(`Light ${id} not found.`);
		}
		light.classList.remove('active');
	}

	findLight(id) {
		return this.lightsMap[id];
	}
}
