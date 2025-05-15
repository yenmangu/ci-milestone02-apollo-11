import { getTestResponse } from './api.js';
import { initProgram } from './init.js';

document.addEventListener('DOMContentLoaded', async () => {
	const testResponseData = await getTestResponse();

	await initProgram();
});

// NEXT : UPDATE UI TO SHOW VERBS / NOUNS
