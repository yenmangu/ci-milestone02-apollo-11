import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { IdleView } from './idleView.js';

export class IdleController {
	/**
	 * @param {IdleView} idleView
	 * @param {DSKYInterface} dskyInterface
	 */
	constructor(idleView, dskyInterface) {
		this.idleView = idleView;
		this.dsky = dskyInterface;
	}
}
