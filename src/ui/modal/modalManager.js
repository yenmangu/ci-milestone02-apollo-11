/**
 * @typedef {import("../../types/uiTypes.js").ModalElements} Modals
 */

export class ModalManager {
	/**
	 *
	 * @param {Modals} modals
	 */
	constructor(modals) {
		/** @type {Modals} */ this.modals = modals;
		this.currentModal = null;
	}
}
