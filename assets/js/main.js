// @ts-check
/// <reference path='./util/types.js' />

import { getTestResponse } from './api.js';
import { initProgram } from './init.js';
import {
	renderResponseData,
	setDskyStateZero,
	testDskyPushButtons
} from './renderUI.js';
document.addEventListener('DOMContentLoaded', async () => {
	const testResponseData = await getTestResponse();
	// Start dev testing methods
	// console.log('testing modules "test response data": ', testResponseData);
	// renderResponseData(testResponseData);
	// testDskyPushButtons();
	setDskyStateZero();
	// End dev testing methods

	initProgram();
});

// NEXT : UPDATE UI TO SHOW VERBS / NOUNS
