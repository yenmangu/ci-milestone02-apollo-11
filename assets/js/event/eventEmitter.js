import {} from '@types';

/**
 * A simple event emitter, inspired by the Angular EventEmitter
 * @template {string} EventMap
 * @typedef {import('@types').EventEmitterInstance<EventMap>} EventEmitterInstance
 */

/**
 * @template {string} EventMap
 * @implements {EventEmitterInstance<EventMap>}
 */
export default class EventEmitter {
	constructor() {
		this.events = {};
		this.debug = false; // Set to true for debug
	}

	on(event, listener) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);
	}

	emit(event, data) {
		if (this.events[event]) {
			this.events[event].forEach(listener => listener(data));
			console.log(this.events);
		}
	}

	subscribe(event, listener) {
		this.on(event, listener);

		const unsubscribe = () => {
			this.events[event] = this.events[event]?.filter(fn => fn !== listener) || [];
			if (this.debug) {
				console.debug(`[EventEmitter] Unsubscribed from "${event}"`);
			}
		};
		const log = () => {
			console.log(`[EventEmitter] Listeners for "${event}": `, this.events[event]);
			return { unsubscribe, log };
		};
		return { unsubscribe, log };
	}

	log() {}
}
