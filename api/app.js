import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/route.js';
const app = express();
// const { isTrustedOrigin, processOrigin } = require('./utils/origin.js');
import { isTrustedOrigin, processOrigin, TRUSTED_ORIGINS } from './utils/origin.js';
/**
 * Custom CORS origin check function
 *
 * @param {string|undefined} origin origin of request
 * @param {(err: Error | null, allow?: boolean) => void} callback The CORS callback function
 */
function checkOrigin(origin, callback) {
	console.log('Checking origin...');
	if (!origin) {
		console.log('No origin, allowing all origins');
		callback(null, true);
		return;
	}
	const cleanedOrigin = processOrigin(origin);

	if (isTrustedOrigin(cleanedOrigin)) {
		console.log('Origin is trusted:', cleanedOrigin);
		callback(null, true);
	} else {
		console.log('Origin is not trusted:', cleanedOrigin);
		callback(new Error('Not allowed by CORS'), false);
	}
}

/**
 * @type {import('cors').CorsOptions}
 */
const corsOptions = {
	optionsSuccessStatus: 200,
	origin: checkOrigin
};

// console.log('apiRouter: ', apiRouter);
app.use(cors(corsOptions));
app.use('/apollo', apiRouter);

export default app;
