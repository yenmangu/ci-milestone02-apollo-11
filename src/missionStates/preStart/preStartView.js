import { cast } from '../../util/cast.js';
import { PreStartController } from './preStartController.js';
/**
 * @class
 * Extends `EventTarget` to enable custom event dispatching,
 * without needing an instance of the controller injected
 */
export class PreStartView extends EventTarget {
	/**
	 * @typedef {import('../../types/uiTypes.js').startButton} startButon
	 * @typedef {import('../../types/uiTypes.js').StartContainer} startContainer
	 */

	constructor() {
		super();
		// console.trace('Instance pre start view created');
		this.startButton = document.querySelector('button#startBtn');
		this.resetButton = document.querySelector('button#goBack');
		this.uiElements = document.querySelectorAll('section[id$="-ui"]');
		this.startContainer = document.querySelector('section[id="pre-start"]');
		console.log('Ui el: ', this.uiElements);

		this.startButton.addEventListener('click', e => {
			this.emitEvent('userStarted');
		});

		this.resetButton.addEventListener('click', e => {
			this.emitEvent('reset');
		});
		this.resetContainer = document.querySelector('section#go-back');
	}

	onStart() {
		this.showUI();
		this.hide(this.startContainer);
		this.show(this.resetContainer);
		// this.hideStart(this.uiElements.startButton);
	}

	onReset() {
		this.hide(cast(this.startContainer));
		for (const [index, element] of Object.entries(this.uiElements)) {
			const htmlEl = cast(element);
			this.hide(htmlEl);
		}
		this.show(this.startContainer);
		this.hide(this.resetContainer);
	}

	/**
	 *
	 * @param {HTMLElement[]} errorArr
	 * @returns {string}
	 */
	buildError(errorArr) {
		let errorString = '';
		errorArr.forEach(err => {
			errorString += ` ${err},`;
		});
		return errorString;
	}

	/**
	 *
	 * @param {string} elList
	 */
	showError(elList) {
		alert(`Error: Element/s ${elList} Not found`);
	}

	showUI() {
		// console.log('Showing UI Elements');
		// console.log('Ui Element: ', this.uiElements);
		for (const [index, element] of Object.entries(this.uiElements)) {
			if (element.classList.contains('hidden')) {
				element.classList.remove('hidden');
			}
		}
	}

	/**
	 *
	 * @param {string} eventType
	 */
	emitEvent(eventType) {
		this.dispatchEvent(
			new CustomEvent(eventType, {
				bubbles: true,
				detail: { eventType }
			})
		);
	}

	/**
	 *
	 * @param {Element} uiElement
	 */
	hide(uiElement) {
		const el = cast(uiElement);
		if (!el.classList.contains('hidden')) {
			el.classList.add('hidden');
		}
	}

	/**
	 *
	 * @param {Element} uiElement
	 */
	show(uiElement) {
		const el = cast(uiElement);
		if (el.classList.contains('hidden')) {
			el.classList.remove('hidden');
		}
	}
}
