import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { DescentOrbitView } from './descentOrbitView.js';

export class DescentOrbitController {
	/**
	 * @param {DescentOrbitView} descentOrbitView
	 * @param {DSKYInterface} dskyInterface
	 */
	constructor(descentOrbitView, dskyInterface) {
		this.idleView = descentOrbitView;
		this.dsky = dskyInterface;
	}
}
