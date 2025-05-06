export function renderResponseData(responseData) {
	const errorMessage = 'no response data';
	const responseDiv = document.getElementById('response');
	if (responseDiv) {
		responseDiv ? (responseDiv.innerText = responseData) : '';
		if (responseDiv.parentElement) {
			const moduleTestDiv = document.createElement('div');
			moduleTestDiv.innerText = 'Modules working and this div has been inserted';
			responseDiv.appendChild(moduleTestDiv);
		}
	}
}
