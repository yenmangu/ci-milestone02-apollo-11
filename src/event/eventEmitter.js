import {} from '../types/EventTypes.js';

/**
 * @template {string} EventType
 * @typedef {import('../types/EventTypes.js').EventEmitterInstance<EventType>} EventEmitterInstance
 */

/**
 * A simple event emitter, inspired by the Angular EventEmitter
 * @template {string} EventType
 * @implements {EventEmitterInstance<EventType>}
 */
export default class EventEmitter {
	/** @type {Record<EventType | '*', Function[]>} */ events;
	constructor() {
		this.events = /** @type {Record<string | '*', Function[]>} */ ({});
		this.debug = false; // Set to true for debug
	}

	/**
	 * @param {EventType | '*' } event
	 * @param {(payload:any) => void} listener
	 * @returns {{unsubscribe: () => void}}
	 */
	on(event, listener) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);

		return {
			unsubscribe: () => this.off(event, listener)
		};
	}

	/**
	 * Emits an event to all listeners of the given type
	 * @param {EventType} type
	 * @param {any} [payload]
	 */
	emit(type, payload) {
		if (this.debug && type !== 'tick') {
			console.debug(`[EventEmitter] Emitting "${type}":`, payload);
		}

		// Emit to specific
		if (this.events[type]) {
			this.events[type].forEach(listener => listener(payload));
		}
		// Emit to wildcard listeners
		// if (this.events['*']) {
		// 	this.events['*'].forEach(listener => listener({ type, payload }));
		// }
	}

	/**
	 * Shorthand for subscribing to all events
	 * @param {(event: {type: EventType, payload: any})=> void} listener
	 * @returns {({ unsubscribe: () => void, log: () => import('../types/EventTypes.js').Subscription })}
	 */
	subscribe(listener) {
		const wildcard = '*';
		this.on(wildcard, listener);

		const subscription = {
			unsubscribe: () => {
				this.off(wildcard, listener);
				if (this.debug) {
					console.debug(`[EventEmitter] Unsubscribed from "${wildcard}"`);
				}
			},
			log: () => {
				if (wildcard)
					console.log(
						`[EventEmitter] Listeners for "${wildcard}": `,
						this.events[wildcard]
					);
				return subscription;
			}
		};
		return subscription;
	}

	/**
	 * Remove the listener.
	 * @param {EventType | '*'} event
	 * @param {(payload:any) => void} listener
	 */
	off(event, listener) {
		if (typeof listener !== 'function') return;
		if (this.events[event]) {
			this.events[event] = this.events[event].filter(fn => fn !== listener);
		}
	}
}
