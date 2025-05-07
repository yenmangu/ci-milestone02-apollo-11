import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/route.js';
const app = express();
import { stripWwwSubdomain, isTrustedOrigin } from './utils/origin.js';

/**
 * Custom CORS origin check function
 *
 * @param {string|undefined} origin origin of request
 * @param {(err: Error | null, allow?: boolean) => void} callback The CORS callback function
 */
function checkOrigin(origin, callback) {
	console.log('Checking origin...');
	const cleanedOrigin = stripWwwSubdomain(origin);
	if (isTrustedOrigin(cleanedOrigin) || !origin) {
		console.log(`Allowed origin: ${cleanedOrigin}`);

		callback(null, true);
	} else {
		console.error(`Error! Origin: ${origin} is not trusted.`);
		callback(new Error('unauthorized origin'));
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
