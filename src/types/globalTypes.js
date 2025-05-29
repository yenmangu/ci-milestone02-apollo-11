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
*   on: (
*     event: EventType | '*',
*     listener: (payload: any) => void
*   ) => { unsubscribe: () => void },
*   emit: (
*     type: EventType,
*     payload?: any
*   ) => void,
*   subscribe: (
*     listener: (event: { type: EventType, payload: any }) => void
*   ) => { unsubscribe: () => void, log: () => any },
*   off: (
*     event: EventType | '*',
*     listener: (payload: any) => void
*   ) => void
* }} EventEmitterInstance
*
*/

export {};
