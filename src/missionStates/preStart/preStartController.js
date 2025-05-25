import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { PreStartView } from './preStartView.js';

/**
 * @typedef {import('../../types/uiTypes.js').PreStartUIElements} UIElements
 * @typedef {import('../../types/uiTypes.js').DSKYElements} DSKYElements
 */

export class PreStartController {
	/**
	 *
	 * @param {DSKYInterface} dskyInterface
	 */
	constructor(preStartView, dskyInterface) {
		this.preStartView = preStartView;
		this.dsky = dskyInterface;
	}
}
