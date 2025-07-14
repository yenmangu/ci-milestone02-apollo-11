/**
 * @typedef {import("../../types/uiTypes.js").HudMap} HudMap
 *
 */

export class HudRenderer {
	/**
	 *
	 * @param {HudMap} hudMap
	 */
	constructor(hudMap) {
		/** @type {HudMap} */ this.hudMap = hudMap;
	}
	renderInitialState() {
		console.error('Method not implemented.');
	}

	render(status) {}
}
