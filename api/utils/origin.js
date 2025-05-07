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

module.exports = { TRUSTED_ORIGINS, parseUrlObject };
