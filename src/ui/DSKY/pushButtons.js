/**
 * @typedef {import("../../types/uiTypes.js").PushButtonsMap} PushButtonsMap
 */

import { pushButtonEmitter } from '../../event/eventBus.js';

export class PushButtons {
	/**
	 *
	 * @param {PushButtonsMap} buttons
	 */
	constructor(buttons) {
		/** @type {PushButtonsMap} */ this.buttons = buttons;
		this.onPress = null;

		for (const [key, el] of Object.entries(this.buttons)) {
			el.addEventListener('click', () => {
				if (this.onPress) {
					this.onPress(key);
				}
			});
		}
		console.log('Push Buttons Map: ', buttons);
	}

	/**
	 *
	 * @param {(key: string) => void} callback
	 */
	setOnPress(callback) {
		this.onPress = callback;
	}

	lock() {
		for (const [key, val] of Object.entries(this.buttons)) {
			if (this.buttons[key] === val) {
				val.disabled = true;
			}
		}
	}

	unlock() {
		Object.entries(this.buttons).forEach(([_, val]) => {
			val.disabled = !val.disabled;
		});
	}
}
