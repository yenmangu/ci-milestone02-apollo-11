/**
 * Centralised types declaration file for JSDOC and enums
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
	ENTR: 'entr'
};

/**
 * @typedef {'verb' | 'noun' | 'rset' | 'plus' | 'minus' | 'key-rel' | 'pro'} Mode
 */

/**
 * @typedef {Object} KeypadState
 * @property {Mode | null} mode
 * @property {string | null} verb
 * @property {string | null} noun
 * @property {string} buffer
 *
 *
 * @typedef {Object} keypadStateManager
 * @property {(mode: 'verb' | 'noun'  )=> void} setMode
 * @property {(digit: string) => void} appendDigit
 * @property {() =>  void} finalise
 * @property {() =>  void} reset
 * @property {() =>  KeypadState} getState
 *
 *
 * @typedef {ReturnType<import("../keypad/keypadStateManager.js").default>} KeypadManager
 *
 * @typedef {import('../seven-segment/sevenSegment.js').SevenSegmentDisplay} SevenSegmentDisplay
 *
 *
 */
