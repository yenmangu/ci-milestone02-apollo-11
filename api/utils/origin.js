const { LOCAL, LOCALHOST, YENMANGU_ME, GITHUB_PAGES } = require('./env.js');

const TRUSTED_ORIGINS = [LOCAL, LOCALHOST, YENMANGU_ME, GITHUB_PAGES];

function parseUrlObject(origin) {
	try {
		const url = new URL(origin);
		return url;
	} catch (error) {
		return undefined;
	}
}

function stripWwwSubdomain(urlInput) {
	try {
		const url = urlInput instanceof URL ? urlInput : new URL(urlInput);
		const hostname = url.host.replace(/^www\./, '');
		return `${url.protocol}//${hostname}`;
	} catch (error) {
		throw new Error('Failed to strip www. subdomain');
	}
}

module.exports = { TRUSTED_ORIGINS, parseUrlObject, stripWwwSubdomain };
