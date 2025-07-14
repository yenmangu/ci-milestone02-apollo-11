/**
 * @typedef {import("../../types/uiTypes.js").ModalElements} Modals
 */

export class ModalManager {
	prepare() {
		throw new Error('Method not implemented.');
	}
	/**
	 *
	 * @param {Modals} modals
	 */
	constructor(modals) {
		/** @type {Modals} */ this.modals = modals;
		this.currentModal = null;
	}
}
