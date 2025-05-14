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
	/**
	 * @type {Record<EventMap, Function[]>}
	 */
	events;
	constructor() {
		this.events = /** @type {Record<EventMap, Function[]>} */ ({});
		this.debug = false; // Set to true for debug
	}

	/**
	 * @param {EventMap} event
	 * @param {(data?: any) => void} listener
	 */
	on(event, listener) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);
	}

	/**
	 *
	 * @param {EventMap} event
	 * @param {any} [data]
	 */
	emit(event, data) {
		if (this.events[event]) {
			this.events[event].forEach(listener => listener(data));
			console.log(this.events);
		}
	}

	/**
	 * @param {EventMap} event
	 * @param {(data?: any) => void} listener
	 * @returns {({ unsubscribe: () => void, log: () => import('@types').Subscription })}
	 */
	subscribe(event, listener) {
		this.on(event, listener);

		const subscription = {
			unsubscribe: () => {
				this.events[event] =
					this.events[event]?.filter(fn => fn !== listener) || [];
				if (this.debug) {
					console.debug(`[EventEmitter] Unsubscribed from "${event}"`);
				}
			},
			log: () => {
				console.log(
					`[EventEmitter] Listeners for "${event}": `,
					this.events[event]
				);
				return subscription;
			}
		};
		return subscription;
	}

	log() {}
}
