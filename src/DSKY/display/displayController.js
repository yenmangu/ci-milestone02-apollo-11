import { cast } from '../../util/cast.js';
import { DisplayRender } from './displayRender.js';

export class DisplayController {
	constructor(displayMap) {
		this.displayMap = displayMap;
		this.displayRender = new DisplayRender();
	}

	/**
	 *
	 * @param {string} id - The display ID (e.g.,'verb', 'noun', 'register_1' etc)
	 * @param {string} value - The value to display
	 */
	write(id, value) {
		const el = this.displayMap[id];
		if (!el) {
			console.warn(`Seven segment display: no element found for ID '${id}'`);
			return;
		}
		el.textContent = value;
	}

	/**
	 * Writes multiple values at once
	 * @param {Record<string,string>} values
	 */
	bulkWrite(values) {
		for (const [id, value] of Object.entries(values)) {
			this.write(id, value);
		}
	}

	clearVerbNoun() {}
}
