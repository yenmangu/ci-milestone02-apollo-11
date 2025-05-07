const { parseUrlObject } = require('../origin.js');
const { TRUSTED_ORIGINS } = require('../origin.js');
const dotenv = require('dotenv').config();

describe('TRUSTED_ORIGINS should exist and returns correct results', () => {
	it('should return non empty', () => {
		expect(TRUSTED_ORIGINS.length > 0);
	});
	it('0 should equal "127.0.0.1"', () => {
		expect(TRUSTED_ORIGINS[0]).toBe('http://127.0.0.1');
	});
	it('should contain the correct elements', () => {
		// Use toStrictEqual for deep equality checking, because elements in array are 'deep'
		expect(TRUSTED_ORIGINS).toStrictEqual([
			'http://127.0.0.1',
			'http://localhost',
			'https://www.yenmangu.me',
			'https://yenmangu.github.io/ci-milestone02-apollo-11'
		]);
	});
});

describe('parseUrlObject function works correctly', () => {
	it('should exist', () => {
		expect(parseUrlObject).toBeDefined();
	});
	it('should return undefined if the privided origin is not url string', () => {
		const invalidUrl = 'not a url';
		const result = parseUrlObject(invalidUrl);
		expect(result).toBeUndefined();
	});
	it('should return a URL object if a valid url string', () => {
		const origin = 'https://www.example.com';
		const urlObject = parseUrlObject(origin);
		expect(urlObject).toBeInstanceOf(URL);
	});
});
