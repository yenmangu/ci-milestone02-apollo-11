import { API_URL, AUDIO_PATH } from './env.js';
const audioApi = API_URL + AUDIO_PATH;

export const getTestResponse = async () => {
	try {
		console.log('audioApi: ', audioApi);

		const response = await fetch(audioApi);
		const data = await response.json();
		return JSON.stringify(data);
	} catch (error) {
		console.error('Error fetching API data: ', error);
		return error;
	}
};
