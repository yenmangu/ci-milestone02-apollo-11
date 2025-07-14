/**
 * @typedef {import("../types/uiTypes.js").UIStructure} UI
 */

import { DskyController } from './DSKY/dskyRenderer.js';
import { HudRenderer } from './HUD/hudRenderer.js';
import { ModalManager } from './modal/modalManager.js';
import { UISectionManager } from './uiSections/uiSectionManager.js';

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
	}
	init() {
		this.hud.renderInitialState();
		this.modals.prepare();
		this.dsky.setInitialState();
		console.error('Method not implemented.');
	}

	updateHUD(status) {
		this.hud.render(status);
	}

	showInstructionModal(message) {}
}
