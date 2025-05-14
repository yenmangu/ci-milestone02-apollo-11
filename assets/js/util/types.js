/**
 * @fileoverview Global type definitions for the Apollo 11 project.
 * Use via JSDoc or import path alias `@types`
 */

/**
 * Centralised types declaration file for JSDOC and enums
 */

/**
 * Display map for the seven-segment displays
 * @typedef {Record<string,HTMLElement>} displayMap
 */

/**
 * @enum {string}
 */
export const ModeTypes = {
	VERB: 'verb',
	NOUN: 'noun',
	RSET: 'rset',
	PLUS: 'plus',
	MINUS: 'minus',
	KEYREL: 'key-rel',
	PRO: 'pro',
	ENTR: 'entr',
	CLR: 'clr'
};

/**
 * @typedef {'verb' | 'noun' | 'rset' | 'plus' | 'minus' | 'key-rel' | 'pro' | 'clr'} Mode
 */

/**
 * @typedef {{
 * 		write: (
 * 			id: string, value:string
 * 			) => void,
 * 		bulkWrite: (
 * 			values: Record<string, string>
 * 			) => void,
 * 		clearVerbNoun: () => void
 * }} DisplayInterface
 *
 */

/**
 * @typedef {Object} KeypadState
 * @property {Mode | null} mode
 * @property {string | null} verb
 * @property {string | null} noun
 * @property {string} buffer
 * @property {string} polarity
 *
 *
 * @typedef {Object} keypadStateManager
 * @property {(mode: 'verb' | 'noun' | 'clr' )=> void} setMode
 * @property {(digit: string) => void} appendDigit
 * @property {(polarity: string) => void} setPolarity
 * @property {() =>  void} finalise
 *
 * @property {() =>  void} reset
 * @property {() =>  KeypadState} getState
 *
 *
 *
 * @typedef {ReturnType<import("../keypad/keypadStateManager.js").default>} KeypadManager
 *
 * @typedef {import('../seven-segment/sevenSegment.js').SevenSegmentDisplay} SevenSegmentDisplay
 *
 */

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
