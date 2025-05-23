/**
 * EventEmitter & Subscription Types
 */

/**
 * @typedef {Object} Subscription
 * @property {() => void} unsubscribe - Removes the current listener
 * @property {() => Subscription} log - Logs current listener and
 * returns subscription for chaining
 */

/**
 * @typedef {Object} EventObjectType
 * @property {string} type
 * @property {any} data
 */

/**
 * @typedef {string} EventType
 */

/**
 * @template {string} EventType

 * @typedef {{
* 	on:
* 		(event: string | '*',
* 			listener:
* 				(event: {
* 					type: string | '*',
* 					action?: any
* 				} & Record<string,any>
* 			) => void
* 		) => void,
* 	emit:
* 		(eventObj: {
* 			type: string | '*',
* 			action?:any
* 			} & Record <string, any>
* 		) => void,
* 	subscribe:
* 		(listener:
* 			(event: {
* 				type: string | '*',
* 				action?:any
* 				} & Record<string, any>
* 			) => void
* 		) => Subscription
* }} EventEmitterInstance
*
*/

export {};
