import { DisplayView } from '../../DSKY/display/displayView.js';
import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { PreStartView } from './preStartView.js';

/**
 * @typedef {import('../../types/uiTypes.js').PreStartUIElements} UIElements
 * @typedef {import('../../types/uiTypes.js').DSKYElements} DSKYElements
 */

export class preStartController {
	/**
	 *
	 * @param {DSKYInterface} dskyInterface
	 */
	constructor(dskyInterface) {
		this.preStartView = new PreStartView();
		this.dsky = dskyInterface;
	}

	// async onStart() {
	// 	try {
	// 		await this.userStartAsync();
	// 		// const sections =
	// 		// this.
	// 	} catch (error) {}
	// }

	// async userStartAsync() {
	// 	return new Promise((resolve, reject) => {
	// 		const sections = this.getUI();

	// 		resolve();
	// 	});
	// }

	// /**
	//  * @returns {UIElements}
	//  */
	// getUI() {
	// 	/** @type {HTMLElement | null} */
	// 	const animationDisplay = document.getElementById('lemAnimation-ui');

	// 	/** @type {NodeListOf<HTMLElement> | null} */
	// 	const instrumentsArray = document.querySelectorAll(
	// 		'.landing-iu [id^="instrument"]'
	// 	);

	// 	/** @type {HTMLElement | null} */
	// 	const startButton = document.getElementById('startBtn');

	// 	/** @type {HTMLElement | null} */
	// 	const startContainer = document.getElementById('pre-start');

	// }
}
