/**
 * @typedef {import("../types/uiTypes.js").UIStructure} UI
 */

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
	}

	updateHUD(status) {
		this.hud.render(status);
	}

	showInstructionModal(message) {}
}
