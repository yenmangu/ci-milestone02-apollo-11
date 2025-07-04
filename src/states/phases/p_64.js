import { BasePhase } from './basePhase.js';

export class P_64 extends BasePhase {
	onEnter() {
		this.log('P_64 Entered');
	}

	onExit() {
		this.log('P_64 completed');
	}
}
