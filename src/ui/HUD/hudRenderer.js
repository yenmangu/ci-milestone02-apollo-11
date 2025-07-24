/**
 * @typedef {import("../../types/uiTypes.js").HudMap} HudMap
 * @typedef {import("../../types/uiTypes.js").UIState} UIState
 * @typedef {import("../../types/uiTypes.js").TelemetryKey} TKey
 * @typedef {import("../../types/uiElementTypes.js").HudRuntypeKey} HudRuntypeKey
 */

import { createSvgUse, svgExport } from '../../util/svg.js';

export class HudRenderer {
	/**
	 *
	 * @param {HudMap} hudMap
	 */
	constructor(hudMap) {
		/** @type {HudMap} */ this.hudMap = hudMap;
	}
	renderCue(cueText) {
		throw new Error('Method not implemented.');
	}
	renderPrompt(prompt) {
		throw new Error('Method not implemented.');
	}
	/**
	 *
	 */
	renderInitialState() {
		for (const [key, _] of Object.entries(this.hudMap)) {
			const tKey = /** @type {TKey} */ (key);

			this.renderTelemetry(tKey, '');
		}
		// this.updateMissionClock('00:00:00');
	}

	/**
	 *
	 * @param {string} phaseName
	 */
	renderPhaseName(phaseName) {
		this.hudMap.phaseName.innerText = phaseName;
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
	/**
	 *
	 * @param {string} getStamp
	 */
	updateMissionClock(getStamp) {
		this.hudMap.getStamp.innerText = getStamp;
	}

	/**
	 *
	 * @param {HudRuntypeKey} type
	 * @param {any} data
	 */
	updateHudBasedOnType(type, data) {
		console.log('Cue: ', data);

		this.hudMap[type].innerHTML = data;
	}

	setFFPrompt() {
		console.log('Setting FF prompt');

		this.hudMap.prompt.innerHTML = '';
		const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		icon.classList.add('icon', 'ff');
		icon.setAttribute('width', '16');
		icon.setAttribute('height', '16');
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-ff');
		icon.appendChild(use);

		const ffIcon = createSvgUse();
		this.hudMap.prompt.innerHTML = '';
		ffIcon.classList.add('ff');

		ffIcon.classList.add('ff-flash');
		this.hudMap.prompt.appendChild(ffIcon);
	}

	clearPrompt() {
		console.log('Clearing prompt');

		this.hudMap.prompt.innerHTML = '';
	}

	clearTranscript() {
		this.hudMap.transcript.innerHTML = '';
	}
}
