/**
 * @typedef {import("../types/uiTypes.js").UIStructure} UI
 * @typedef {import('../types/runtimeTypes.js').PhaseState} PhaseState
 * @typedef {import('../types/uiTypes.js').UIState} UIState
 * @typedef {import('../types/uiTypes.js').Telemetry} Telemetry
 * @typedef {import('../types/uiTypes.js').altitudeUnits} AltitudeUnits
 * @typedef {import('../types/uiTypes.js').TelemetryKey} TKey
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
		console.log('Init UI');
		this.startEmitter = startEmitter;
		/** @type {HTMLButtonElement | undefined} */ this.startButton;
		this.initStartButton();
		/** @type {AltitudeUnits} */ this.altitudeUnits = 'miles';
		/** @type {Telemetry} */ this.currentTelemetry;
	}

	initStartButton() {
		const startEl = document.getElementById('startBtn');
		if (!startEl) {
			throw new Error('Error no start button found');
		}
		this.startButton = /** @type {HTMLButtonElement} */ (startEl);
		this.startButton.addEventListener('click', () => {
			this.start();
		});
	}

	init() {
		this.hud.renderInitialState();
		this.modals.prepare();
		this.dsky.setInitialState();
	}

	start() {
		this.startEmitter.emit('start');
		this.sections.init();
		this.init();
	}

	/**
	 *
	 * @param {UIState} initialData
	 */
	setInitialState(initialData) {
		throw new Error('Method not implemented.');
	}

	/**
	 *
	 * @param {UIState} status
	 */
	updateHUD(status) {
		this.currentTelemetry = this.buildTelemetry(status);

		if (status.prompt) {
			this.hud.renderPrompt(status.prompt);
		}
		if (status.cueTranscript) {
			this.hud.renderCue(status.cueTranscript);
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
	 * @param {AltitudeUnits} altUnits
	 */
	updateAltitudeUnits(altUnits) {
		this.altitudeUnits = altUnits;
	}

	showInstructionModal(message) {}
}
