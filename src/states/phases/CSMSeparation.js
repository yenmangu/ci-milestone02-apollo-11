import { BasePhase } from './basePhase.js';

export class CSMSeparation extends BasePhase {
	onEnter() {
		this.log('Phase: CSM Separation');
	}
	onTick() {}

	onExit() {
		this.log('Phase:  CSM Separation complete');
	}
}
