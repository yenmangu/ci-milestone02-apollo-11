import { API_URL, LOCAL_API_URL, AUDIO_PATH, LOCALHOST, LOCAL_IP } from './env.js';
let apiUrl;
// For accessing Local API
if (
	window.location.hostname === LOCALHOST ||
	window.location.hostname === LOCAL_IP
) {
	// local dev
	apiUrl = LOCAL_API_URL;
} else {
	// remote dev
	apiUrl = API_URL;
}

// Uncomment this line to use the remote API
const audioApi = API_URL + AUDIO_PATH;

// const audioApi = apiUrl + AUDIO_PATH;

export const getTestResponse = async () => {
	try {
		console.log('api.js audioApi: ', audioApi);

		const response = await fetch(audioApi);
		const data = await response.json();
		return JSON.stringify(data);
	} catch (error) {
		console.error('Error fetching API data: ', error);
		return error;
	}
};
