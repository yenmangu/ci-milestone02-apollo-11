import { ModeTypes } from './util/types.js';

/**
 * @param {MouseEvent} e
 * @param {import('./util/types.js').KeypadManager} keypadStateManager
 *
 */
function handleDskyInput(e, keypadStateManager) {
	// 'Cast' to HTMLElement to enable dataset with intellisense
	const target = /** @type {HTMLButtonElement} */ (e.currentTarget);
	const type = target.dataset.dsky;
	console.log('Type pressed: ', type);
	if (!type) {
		throw new TypeError('No type pased to handleDskyInput');
	}

	if (Object.values(ModeTypes).includes(type)) {
		console.log('Found type in enum');

		switch (type) {
			//control entry
			case 'verb':
			case 'noun':
				setMode(type, keypadStateManager);
				break;
			case 'entr':
				keypadStateManager.finalise();
				updateActiveButtons(null);
				break;
			case 'clr':
				keypadStateManager.reset();
				updateActiveButtons(null);
				break;
			// numerical entry

			case 'rset':
			case 'plus':
			case 'minus':
			case 'key-rel':
			case 'pro':
				console.log(`${type} selected`);
				break;
			default:
				console.log(`Type selected: ${type}`);
		}
	} else {
		keypadStateManager.appendDigit(type);
	}
}
/**
 *
 * @param {string} type
 * @returns {type is import('./util/types.js').Mode}
 */
function isValidMode(type) {
	return Object.values(ModeTypes).includes(type);
}

/**
 *
 * @param {'verb'|'noun'} type
 * @param {ReturnType<typeof import('./keypad/keypadStateManager.js').default>} keypadStateManager
 */
function setMode(type, keypadStateManager) {
	keypadStateManager.setMode(type);
	updateActiveButtons(type);
}

function updateActiveButtons(activeType) {
	document.querySelectorAll('.push-button').forEach(btn => {
		const el = /** @type {HTMLButtonElement} */ (btn);
		if (!activeType) {
			el.classList.remove('active');
		}
		el.classList.toggle('active', el.dataset.dsky === activeType);
	});
}

/**
 *
 * @param {ReturnType <typeof import('./keypad/keypadStateManager.js').default>} keypadStateManager
 */
export function initKeypadUI(keypadStateManager) {
	document.querySelectorAll('.push-button').forEach(btn => {
		const el = /** @type {HTMLButtonElement}*/ (btn);
		el.addEventListener('click', e => handleDskyInput(e, keypadStateManager));
	});
}
