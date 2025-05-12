import { getTestResponse } from './api.js';
import {
	renderResponseData,
	setDskyStateZero,
	testDskyPushButtons
} from './renderUI.js';
import { initKeypadUI } from './userInput.js';
document.addEventListener('DOMContentLoaded', async () => {
	const testResponseData = await getTestResponse();

	console.log('testing modules "test response data": ', testResponseData);
	renderResponseData(testResponseData);
	testDskyPushButtons();
	setDskyStateZero();
	initKeypadUI();
});
