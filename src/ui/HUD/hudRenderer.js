/**
 * @typedef {import("../../types/uiTypes.js").HudMap} HudMap
 * @typedef {import("../../types/uiTypes.js").UIState} UIState
 * @typedef {import("../../types/uiTypes.js").TelemetryKey} TKey
 *
 */

export class HudRenderer {
	renderCue(cueText) {
		throw new Error('Method not implemented.');
	}
	renderPrompt(prompt) {
		throw new Error('Method not implemented.');
	}
	/**
	 *
	 * @param {HudMap} hudMap
	 */
	constructor(hudMap) {
		/** @type {HudMap} */ this.hudMap = hudMap;
	}
	renderInitialState() {
		console.warn('Method not implemented.');
	}

	/**
	 *
	 * @param {TKey} key
	 * @param {string} value
	 */
	renderTelemetry(key, value) {
		const el = /** @type {HTMLElement} */ (this.hudMap[key]);
		if (!el) return;
		el.textContent = value;
	}
}
