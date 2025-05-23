/**
 * @fileoverview Type definitions for DSKY components and classes.
 * Use via JSDoc.
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
 * Stripped back version of the display interface
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
 * OLD
 *
 * @typedef {Object} KeypadState
 * @property {Mode | null} mode
 * @property {string | null} verb
 * @property {string | null} noun
 * @property {string} buffer
 * @property {string} polarity
 *
 *
 /**
 * @typedef {Object} keypadStateManager
 * @property {(string )=> void} setMode
 * @property {(digit: string) => void} appendDigit
 * @property {(polarity: string) => void} setPolarity
 * @property {() =>  void} finalise
 *
 * @property {() =>  void} reset
 * @property {() =>  KeypadState} getState
 *
 *
 *
 * @typedef {ReturnType<import("../DSKY/keypad/keypadStateManager.js").default>} KeypadManager
 *
 * @typedef {import('../seven-segment/sevenSegment.js').SevenSegmentDisplay} SevenSegmentDisplay
 *
 */

/**
 * @typedef {Object} DSKYParentInterface
 * @property {(dskyData: string) => string} getPolarity
 * @property {()=> void} resetDsky
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
