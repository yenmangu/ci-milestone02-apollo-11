/**
 * @typedef {import('../../types/keypadTypes.js').DisplayInterface} DisplayInterface
 */

import { jest } from '@jest/globals';

import createKeypadStateManager from '../DSKY/keypadStateManager.js';

describe('keyboard state manager functions as expected', () => {
	/**
	 *
	 * @returns {DisplayInterface}
	 */
	const mockDisplay = () => {
		return {
			write: jest.fn(),
			bulkWrite: jest.fn(),
			clearVerbNoun: jest.fn()
		};
	};
	test('finalise triggers correct display output for V37N63', () => {
		const display = mockDisplay();
		const keypad = createKeypadStateManager(display);

		keypad.setMode('verb');
		keypad.appendDigit('3');
		keypad.appendDigit('7');

		keypad.setMode('noun');
		keypad.appendDigit('6');
		keypad.appendDigit('3');

		keypad.finalise();

		expect(display.bulkWrite).toHaveBeenCalledWith({
			verb: '37',
			noun: '63'
		});
	});
});
