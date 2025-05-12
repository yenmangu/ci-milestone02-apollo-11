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
}
