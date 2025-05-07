const { TRUSTED_ORIGINS } = require('../origin.js');
const dotenv = require('dotenv').config();

describe('TRUSTED_ORIGINS should exist and returns correct results', () => {
	it('should return non empty', () => {
		expect(TRUSTED_ORIGINS.length > 0);
	});
	it('0 should equal "127.0.0.1"', () => {
		expect(TRUSTED_ORIGINS[0]).toBe('http://127.0.0.1');
	});
});

describe('areOriginsTrusted function works correctly', () => {
	it('should exist', () => {
		// expect();
	});
});
