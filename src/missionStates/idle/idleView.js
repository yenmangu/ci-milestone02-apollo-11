import { cast } from '../../util/cast.js';

export class IdleView extends EventTarget {
	constructor() {
		super();
		this.lemUI = document.getElementById('lemUI');
		this.countdownElement = null;
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
		// For now just show the dev count down below
		return this.renderCountdown();
	}

	/**
	 *
	 * @param {number} seconds
	 * @returns {Promise<void>}
	 */
	async renderCountdown(seconds = 3) {
		return new Promise(resolve => {
			if (!this.lemUI) {
				console.warn('lemUI not found');
				resolve();
				return;
			}
			this.lemUI.innerHTML = '';
			const countdownEl = document.createElement('div');
			countdownEl.classList.add('countdown');
			this.lemUI.appendChild(countdownEl);

			let remaining = seconds;

			const tick = () => {
				countdownEl.textContent = `Starting in ${remaining}...`;
				if (remaining <= 0) {
					this.lemUI.innerHTML = '';
					resolve();
					this.dispatchEvent(new Event('phaseIntroComplete'));
				} else {
					remaining--;
					setTimeout(tick, 1000);
				}
			};
			tick();
		});
	}
}
