/**
 * @typedef {import("../types/uiTypes.js").UIStructure} UI
 * @typedef {import('../types/runtimeTypes.js').PhaseState} PhaseState
 * @typedef {import('../types/uiTypes.js').UIState} UIState
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

	updateHUD(status) {
		this.hud.render(status);
	}

	showInstructionModal(message) {}
}
