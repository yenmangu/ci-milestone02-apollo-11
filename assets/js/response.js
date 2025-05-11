const remoteApiUrl = 'https://www.api.yenmangu.me/apollo/';
// local dev
const localApi = 'http://127.0.01:3000/apollo/';
const audioPath = 'audio';

let apiUrl;
if (
	window.location.hostname === 'localhost' ||
	window.location.hostname === '127.0.0.1'
) {
	// local dev
	apiUrl = localApi;
}

// async needed here to ensure try/catch and await works correctly
document.addEventListener('DOMContentLoaded', async () => {
	const responseDiv = document.getElementById('response');
	const audioApi = apiUrl + audioPath;

	try {
		console.log('response.js audioApi: ', audioApi);

		const response = await fetch(audioApi);
		const data = await response.json();
		const divText = `LOCAL API: ${JSON.stringify(data)}`;
		console.log('Div text: ', divText);

		responseDiv ? (responseDiv.innerText = 'divText') : '';
	} catch (error) {
		console.error('Error fetching API data: ', error);
		responseDiv ? (responseDiv.innerText = error) : '';
	}
});
