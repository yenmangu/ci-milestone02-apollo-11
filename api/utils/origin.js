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

function stripWwwSubdomain(urlObject) {
	try {
		if (!(urlObject instanceof URL)) {
			// convert to urlObject
			urlObject = new URL(urlObject);
		}
		const hostname = urlObject.host.replace(/^www\./, '');
		return `${urlObject.protocol}//${hostname}`;
	} catch (error) {
		throw new Error('Failed to strip www. subdomain');
	}
}

module.exports = { TRUSTED_ORIGINS, parseUrlObject, stripWwwSubdomain };
