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
 * @typedef {Object} KeypadState
 * @property {Mode | null} mode
 * @property {string | null} verb
 * @property {string | null} noun
 * @property {string} buffer
 * @property {string} polarity
 */

/**
 * @typedef {Object} keypadStateManager
 * @property {(string )=> void} setMode
 * @property {(digit: string) => void} appendDigit
 * @property {(polarity: string) => void} setPolarity
 * @property {() =>  void} finalise
 * @property {()=> void} keyRel
 * @property {() =>  void} reset
 * @property {() =>  KeypadState} getState
 */

export {};
