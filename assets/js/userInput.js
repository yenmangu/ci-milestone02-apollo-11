import createKeypadStateManager from './keypadStateManager.js';

const dsky = createKeypadStateManager();

/** @param {MouseEvent} e  */
function handleDskyInput(e) {
	// 'Cast' to HTMLElement to enable dataset with intellisense
	const target = /** @type {HTMLButtonElement} */ (e.currentTarget);
	const type = target.dataset.dsky;
	console.log('type in userInput module: ', type);
	switch (type) {
		//control entry
		case 'verb':
		case 'noun':
		case 'rset':
		case 'plus':
		case 'minus':
		case 'key-rel':
		case 'pro':
			setMode(type);
			break;
		// numerical entry
		case 'entr':
			dsky.finalise();
			updateActiveButtons(null);
			break;
		case 'clr':
			dsky.reset();
			updateActiveButtons(null);
			break;
		default:
			dsky.appendDigit(type);
			break;

		// case 'noun':
		// 	setMode(type);
		// 	break;
		// case 'pro':
		// 	setMode(type);
	}
}

function setMode(type) {
	dsky.setMode(type);
	updateActiveButtons(type);
}

function updateActiveButtons(activeType) {
	document.querySelectorAll('.push-button').forEach(btn => {
		const el = /** @type {HTMLButtonElement} */ (btn);
		el.classList.toggle('active', el.dataset.dsky === activeType);
	});
}

export function initKeypadUI() {
	document.querySelectorAll('.push-button').forEach(btn => {
		const el = /** @type {HTMLButtonElement}*/ (btn);
		el.addEventListener('click', handleDskyInput);
	});
}
