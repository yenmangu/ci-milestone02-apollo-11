const apiUrl = 'https://www.api.yenmangu.me/apollo/';
const audioPath = 'audio';

// async needed here to ensure try/catch and await works correctly
document.addEventListener('DOMContentLoaded', async () => {
	const responseDiv = document.getElementById('response');
	const audioApi = apiUrl + audioPath;

	try {
		console.log('audioApi: ', audioApi);

		const response = await fetch(audioApi);
		const data = await response.json();
		responseDiv ? (responseDiv.innerText = JSON.stringify(data)) : '';
	} catch (error) {
		console.error('Error fetching API data: ', error);
		responseDiv ? (responseDiv.innerText = error) : '';
	}
});
