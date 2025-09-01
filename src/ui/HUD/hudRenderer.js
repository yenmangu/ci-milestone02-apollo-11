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
		this.currentPrompt = null;
		/** @type {HTMLElement | null} */ this.hudFF = null;
		this.getHudFF();
	}

	getHudFF() {
		const ff = document.getElementById('hud-ff');
		if (ff) {
			this.hudFF = ff;
		} else {
			console.warn('Hud FF not found');
		}
	}

	renderCue(cueText) {
		this.hudMap.transcript.innerText = cueText;
	}

	renderPrompt(prompt) {
		if (this.currentPrompt) this.currentPrompt = prompt;
		this.hudMap.prompt.innerHTML = `${prompt}`;
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
		this.hudMap[type].innerHTML = data;
	}

	/**
	 *
	 * @param {string} string
	 */
	updatePrompt(string) {
		this.hudMap.prompt.innerHTML = string;
	}

	setFFPrompt() {
		console.log('Setting FF prompt');

		this.hudFF.innerHTML = '';
		const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		icon.classList.add('icon', 'ff');
		icon.setAttribute('width', '16');
		icon.setAttribute('height', '16');
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-ff');
		icon.appendChild(use);

		const ffIcon = createSvgUse();
		this.clearFF();
		ffIcon.classList.add('ff');

		ffIcon.classList.add('ff-flash');
		this.hudFF.appendChild(ffIcon);
	}

	clearFF() {
		this.hudFF.innerHTML = '';
	}

	clearPrompt(resume = true) {
		console.log('Clearing prompt');
		if (resume) {
			this.hudMap.prompt.innerHTML = this.currentPrompt;
		} else {
			this.clearPromptBuffer();
			this.clearPromptHud();
		}
	}

	clearPromptHud() {
		this.hudMap.prompt.innerHTML = '';
	}

	clearPromptBuffer() {
		this.currentPrompt = '';
	}

	clearTranscript() {
		this.hudMap.transcript.innerHTML = '';
	}
}
