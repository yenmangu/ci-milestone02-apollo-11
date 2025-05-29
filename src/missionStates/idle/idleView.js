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

	showPhaseInto() {
		console.log('Showing phase intro');
		return new Promise((resolve, reject) => {
			// Simulate an intro that takes 3 seconds
			// Will replace with actual phase intro
			setTimeout(() => {
				console.log('Idle Phase intro finished');
				resolve();
			}, 3000);
		});
	}
}
