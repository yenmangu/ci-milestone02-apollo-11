import {} from '@types';

/**
 * A simple event emitter, inspired by the Angular EventEmitter
 * @template {string} EventType
 * @typedef {import('@types').EventEmitterInstance<EventType>} EventEmitterInstance
 */

/**
 * @template {string} EventType
 * @implements {EventEmitterInstance<EventType>}
 */
export default class EventEmitter {
	/**
	 * @type {Record<string | '*', Function[]>}
	 */
	events;
	constructor() {
		this.events = /** @type {Record<string | '*', Function[]>} */ ({});
		this.debug = false; // Set to true for debug
	}

	/**
	 * @param {EventType | '*' } event
	 * @param {(event: {type: EventType | '*', data?: any} & Record<string, any>) => void} listener
	 */
	on(event, listener) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);
	}

	/**
	 * Emits an event object with a mandatory `type` property.
	 * @param {{ type: string } & Record<string, any>} eventObj
	 */
	emit(eventObj) {
		const eventType = eventObj.type;

		// Emit to specific
		if (this.events[eventType]) {
			this.events[eventType].forEach(listener => listener(eventObj));
		}
		// Emit to wildcard listeners
		if (this.events['*']) {
			this.events['*'].forEach(listener => listener(eventObj));
		}
	}

	/**
	 * @param {EventType | '*'} event
	 * @param {(event:{type: EventType | '*' } & Record <string, any>) => void} listener
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
}
