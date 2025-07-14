/**
 * @typedef {import("../../types/uiTypes.js").UISections} Sections
 */

export class UISectionManager {
	/**
	 *
	 * @param {Sections} sections
	 */
	constructor(sections) {
		/** @type {Sections} */ this.sections = sections;
	}

	init() {
		this.sections.dsky.classList.remove('hidden');
		this.sections.landing.classList.remove('hidden');
	}

	hideSection(section) {}

	showSection(section) {}
}
