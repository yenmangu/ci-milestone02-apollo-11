/**
 * A simple event emitter, inspired by the Angular EventEmitter
 * @template {string} EventMap
 */
export default class EventEmitter {
	/**
	 * Creates a new EventEmitter instance
	 */
	constructor() {
		/**
		 * A dictionary mapping event names to arrays of listener functions.
		 * @type {Object.<EventMap,Function[]>}
		 */
		this.events = {};
		this.debug = false; // Set to true for debug
	}
	/**
	 * Registers a listener function for a specific event.
	 *
	 * @param {EventMap} event
	 * @param {(data?: any) => void} listener - the callback function to invoke when the event is emitted
	 */
	on(event, listener) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);
	}

	/**
	 *
	 * @param {EventMap} event - The name of the event to emit.
	 * @param {*} [data] - Optional data to pass to the listener function.
	 */
	emit(event, data) {
		if (this.events[event]) {
			this.events[event].forEach(listener => listener(data));
			console.log(this.events);
		}
	}
	/**
	 *
	 * @param {EventMap} event
	 * @param {(data?:any)=> void} listener
	 * @returns {{unsubscribe: () => void, log: () => {unsubscribe: () => void, log: () => void }}} unsubscribe function
	 */
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
