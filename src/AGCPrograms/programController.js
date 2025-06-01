import { agcEmitter, pushButtonEmitter } from '../event/eventBus.js';

/**
 * Class to manage the program state, i.e.,
 * which current AGC program is running,
 * setting alarms etc.
 */
export class ProgramController {
	constructor() {
		this.agcEmitter = agcEmitter;
		this.pushButtonEmitter = pushButtonEmitter;
	}

	initiateEmitter() {
		// this.agcEmitter.
	}
}
