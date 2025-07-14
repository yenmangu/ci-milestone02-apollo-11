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
	}

	/**
	 *
	 * @param {(key: string) => void} callback
	 */
	setOnPress(callback) {
		this.onPress = callback;
	}
}
