import { BasePhase } from './basePhase.js';

export class PoweredDescent extends BasePhase {
	onEnter() {
		this.log('PDI entered');
	}
	onExit() {
		this.log('PDI completed');
	}
}
