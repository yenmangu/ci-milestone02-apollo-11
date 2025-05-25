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
		console.trace('Instance pre start view created');
		this.startButton = document.querySelector('button#startBtn');
		this.uiElements = document.querySelectorAll('section [id$="-ui"]');
		console.log('startButton: ', this.startButton);
		this.startButton.addEventListener('click', e => {
			this.dispatchEvent(new Event('userStarted'));
		});
	}

	onStart() {
		this.showUI();
		// this.hideStart(this.uiElements.startButton);
	}

	/**
	 *
	 * @param {startContainer} startContainer
	 */
	hideStart(startContainer) {
		this.hide(startContainer);
	}

	showUI() {
		// let /** @type {HTMLElement[]} */ errorArr;
		// this.uiElements.DSKYElements.forEach(el => {
		// 	el ? this.show(el) : errorArr.push(el);
		// });
		// if (errorArr.length) {
		// 	this.buildError(errorArr);
		// }
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

	/**
	 *
	 * @param {HTMLElement} uiElement
	 */
	show(uiElement) {
		uiElement.classList.add('hidden');
	}

	/**
	 *
	 * @param {HTMLElement} uiElement
	 */
	hide(uiElement) {
		uiElement.classList.remove('hidden');
	}
}
