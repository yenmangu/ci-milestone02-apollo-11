// const { LOCAL, LOCALHOST, YENMANGU_ME, GITHUB_PAGES } = require('./env.js');
import { LOCAL, LOCALHOST, YENMANGU_ME, GITHUB_PAGES } from './env.js';

const TRUSTED_ORIGINS = [LOCAL, LOCALHOST, YENMANGU_ME, GITHUB_PAGES];

function parseUrlObject(origin) {
	try {
		const url = new URL(origin);
		return url;
	} catch (error) {
		return undefined;
	}
}

function removePort(urlInput) {
	try {
		const url = urlInput instanceof URL ? urlInput : new URL(urlInput);
	} catch (error) {
		throw new Error('Failed to remove port');
	}
}

function stripWwwSubdomain(urlInput) {
	try {
		// console.log('urlInput in stripWwww... :', urlInput);

		const url = urlInput instanceof URL ? urlInput : new URL(urlInput);
		const hostname = url.hostname.replace(/^www\./, '');
		return `${url.protocol}//${hostname}`;
	} catch (error) {
		throw new Error('Failed to strip www. subdomain');
	}
}

function processOrigin(origin) {
	console.log('origin: ', origin);

	const urlObject = parseUrlObject(origin);
	console.log('stripped url: ', stripWwwSubdomain(urlObject));
	return stripWwwSubdomain(urlObject);
}

function isTrustedOrigin(processedOrigin) {
	return TRUSTED_ORIGINS.includes(processedOrigin);
}
// module.exports = {
// 	TRUSTED_ORIGINS,
// 	parseUrlObject,
// 	stripWwwSubdomain,
// 	processOrigin,
// 	isTrustedOrigin
// };
export {
	TRUSTED_ORIGINS,
	parseUrlObject,
	stripWwwSubdomain,
	processOrigin,
	isTrustedOrigin
};
