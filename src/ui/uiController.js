/**
 * @typedef {import("../types/uiTypes.js").UIStructure} UI
 * @typedef {import('../types/runtimeTypes.js').PhaseState} PhaseState
 * @typedef {import('../types/uiTypes.js').UIState} UIState
 * @typedef {import('../types/uiTypes.js').Telemetry} Telemetry
 * @typedef {import('../types/uiTypes.js').altitudeUnits} AltitudeUnits
 * @typedef {import('../types/uiTypes.js').TelemetryKey} TKey
 * @typedef {import('../types/runtimeTypes.js').RuntimeCue} RuntimeCue
 * @typedef {import('../types/uiTypes.js').Controls} Controls
 */

import { cast } from '../util/cast.js';
import { DskyController } from './DSKY/dskyController.js';
import { HudRenderer } from './HUD/hudRenderer.js';
import { ModalManager } from './modal/modalManager.js';
import { UISectionManager } from './uiSections/uiSectionManager.js';
import { startEmitter } from '../event/eventBus.js';

export class UIController {
	/**
	 *
	 * @param {UI} ui
	 */
	constructor(ui) {
		this.ui = ui;
		this.hud = new HudRenderer(ui.hudMap);
		this.modals = new ModalManager(ui.modals);
		this.sections = new UISectionManager(ui.sections);
		this.dsky = new DskyController(ui.dsky);
		this.description = ui.description;
		console.log('Init UI');
		this.startEmitter = startEmitter;
		/** @type {HTMLButtonElement} */ this.startButton = this.ui.controls.start;
		/** @type {HTMLButtonElement} */ this.playPause = this.ui.controls.playPause;
		this.initControls();
		/** @type {AltitudeUnits} */ this.altitudeUnits = 'miles';
		/** @type {Telemetry} */ this.currentTelemetry;
		/** @type {boolean} */ this.showTelemetry = true;
		/** @type {Controls} */ this.controls = ui.controls;
		/** @type {boolean} */ this.isPaused = false;
	}

	initControls() {
		this.startButton.addEventListener('click', () => {
			this.start();
		});

		this.playPause.addEventListener('click', e => {
			e.preventDefault();
			if (this.isPaused) {
				this.startEmitter.emit('play');
				this.playPause.classList.remove('paused');
				this.isPaused = false;
			} else {
				this.startEmitter.emit('pause');
				this.playPause.classList.add('paused');
				this.isPaused = true;
			}
		});
	}

	init() {
		// if (!this.observer) {
		// 	this.observer = new MutationObserver(mutations => {
		// 		mutations.forEach(mutation => {
		// 			const target = /** @type {HTMLElement} */ (mutation.target);
		// 			if (target) {
		// 				console.log(`attribute changed:  ${target.innerText}`);
		// 			}
		// 		});
		// 	});
		// }
		// this.observer.observe(this.ui.hudMap.getStamp, {
		// 	attributes: true,
		// 	childList: true,
		// 	subtree: true
		// });
		this.dsky.setInitialState();
		this.modals.prepare();
	}

	start() {
		this.startEmitter.emit('start');
	}

	setPreStartState() {
		this.isIntro = true;
		this.sections.init();
	}

	/**
	 * Updates every tick, so no logging!
	 * @param {UIState} status
	 */
	updateHUD(status) {
		this.currentTelemetry = this.buildTelemetry(status);

		if (status.prompt) {
			this.hud.renderPrompt(status.prompt);
		}
		if (status.transcript) {
			this.hud.renderCue(status.transcript);
		}

		if (status.getStamp) {
			this.updateMissionClock(status.getStamp);
		}

		if (status.phaseName) {
			this.hud.renderPhaseName(status.phaseName);
		}

		if (!this.currentTelemetry) return;

		for (const [key, value] of Object.entries(this.currentTelemetry)) {
			const tKey = /** @type {TKey} */ (key);
			this.hud.renderTelemetry(tKey, value);
		}
	}

	/**
	 *
	 * @param {UIState} status
	 * @returns {Telemetry}
	 */

	buildTelemetry(status) {
		/** @type {Telemetry} */ const telemetry = {
			altitude: '',
			altUnits: this.altitudeUnits,
			velocity: '0',
			vUnits: '',
			fuel: '0'
		};
		if (status.altitude) {
			telemetry.altitude =
				this.altitudeUnits === 'feet'
					? status.altitude.feet.toString()
					: status.altitude.miles.toString();
		}

		if (typeof status.velocity === 'number') {
			telemetry.velocity = status.velocity.toString();
		}

		if (typeof status.fuel === 'number') {
			telemetry.fuel = status.fuel.toString();
		}

		if (typeof status.vUnits === 'string') {
			telemetry.vUnits = status.vUnits;
		}
		return telemetry;
	}

	/**
	 *
	 * @param {string} getStamp
	 */
	updateMissionClock(getStamp) {
		if (!this.showTelemetry) {
			this.hud.updateMissionClock(getStamp);
		}
	}

	/**
	 *
	 * @param {AltitudeUnits} altUnits
	 */
	updateAltitudeUnits(altUnits) {
		this.altitudeUnits = altUnits;
	}

	/**
	 * Route the cue to appropriate control methods
	 * @param {RuntimeCue} cue
	 */
	routeCue(cue) {
		if (cue.transcript || cue.hud) {
			const message = `${cue.data.speaker}:
				${cue.data.text}`;
			this.hud.updateHudBasedOnType('transcript', message);
		}
	}

	/**
	 *
	 * @param {string | string[]} description
	 */
	updateDescription(description) {
		const descriptionArray = Array.isArray(description)
			? description
			: [description];

		console.log('Description Array: ', descriptionArray);

		const spanElArr = descriptionArray.map(text => {
			const span = document.createElement('span');
			span.innerHTML = text;
			return span;
		});

		this.description.innerHTML = '';

		spanElArr.forEach((el, i) => {
			this.description.appendChild(el);
			if (i < spanElArr.length - 1) {
				this.description.appendChild(document.createElement('br'));
			} else {
				this.description.appendChild(el);
			}
		});
	}

	clearHudTranscript() {
		this.hud.clearTranscript();
	}

	showInstructionModal(message) {}
}
