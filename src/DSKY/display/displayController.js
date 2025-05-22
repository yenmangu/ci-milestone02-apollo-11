import { cast } from '../../util/cast.js';
import { DisplayView } from './displayView.js';

/**
 * @class Display Controller
 * Responsible for writing to the display only.
 *
 */
export class DisplayController {
	/**
	 *
	 * @param {Record<string,HTMLElement>} displayMap
	 * @param {import('../../types/uiTypes.js').DskyDomElements} uiElements
	 */
	constructor(displayMap, uiElements) {
		this.displayMap = displayMap;
		this.displayRender = new DisplayView(uiElements);
	}

	/**
	 *
	 * @param {string} id - The display ID (e.g.,'verb', 'noun', 'register_1' etc)
	 * @param {string} value - The value to display
	 */
	write(id, value) {
		this.displayRender.write(id, value);
	}

	/**
	 * Writes multiple values at once
	 * @param {Record<string,string>} values
	 */
	bulkWrite(values) {
		for (const [id, value] of Object.entries(values)) {
			this.displayRender.write(id, value);
		}
	}

	clearVerbNoun() {
		// this.displayRender.clearVerbNoun()
	}
}
