import { cast } from '../../util/cast.js';

export class IdleView extends EventTarget {
	constructor() {
		super();
	}

	/**
	 *
	 * @param {NodeListOf<Element>} elements
	 */
	showElements(elements) {
		elements.forEach(el => {
			const htmlEl = cast(el);
			if (htmlEl.classList.contains('hidden')) {
				htmlEl.classList.remove('hidden');
			}
		});
	}
}
