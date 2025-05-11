import { getTestResponse } from './api.js';
import { renderResponseData, testDskyPushButtons } from './renderUI.js';
document.addEventListener('DOMContentLoaded', async () => {
	const testResponseData = await getTestResponse();

	console.log('testing modules "test response data": ', testResponseData);
	renderResponseData(testResponseData);
	testDskyPushButtons();
});
