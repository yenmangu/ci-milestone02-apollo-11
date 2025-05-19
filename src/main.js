import { getTestResponse } from './api.js';
import { initProgram } from './init.js';
import pathname from './domain.js';
import { SIMULATOR_PATH } from './env.js';

document.addEventListener('DOMContentLoaded', async () => {
	const testResponseData = await getTestResponse();
	// Only load initProgram on simulator.html
	if (pathname === SIMULATOR_PATH) {
		console.log('Awaiting initProgram');

		await initProgram();
	}
});

// NEXT : UPDATE UI TO SHOW VERBS / NOUNS
