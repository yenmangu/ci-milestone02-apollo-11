import { getTestResponse } from './api.js';
import { initProgram } from './init.js';
import path from './domain.js';
import { HOME_PATH, SIMULATOR_PATH } from './env.js';

document.addEventListener('DOMContentLoaded', async () => {
	if (path === HOME_PATH) {
		const testResponseData = await getTestResponse();
		document.getElementById('home-response').innerText = testResponseData;
	}

	if (path === SIMULATOR_PATH) {
		await initProgram();
	}
});

// NEXT : UPDATE UI TO SHOW VERBS / NOUNS
