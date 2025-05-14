import { getTestResponse } from './api.js';
import { initProgram } from './init.js';
import {
	renderResponseData,
	setDskyStateZero,
	testDskyPushButtons
} from './view/dskyRender.js';
document.addEventListener('DOMContentLoaded', async () => {
	const testResponseData = await getTestResponse();

	initProgram();
});

// NEXT : UPDATE UI TO SHOW VERBS / NOUNS
