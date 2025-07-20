/**
 * @typedef {import('../simulationState.js').SimulationState} SimulationState
 * @typedef {import('../../types/runtimeTypes.js').RuntimePhase} RuntimePhase
 */

import { PhaseIds } from '../../types/timelineTypes.js';
import { BasePhase } from './basePhase.js';

export class Intro extends BasePhase {
	/**
	 *
	 * @param {SimulationState} simState
	 * @param {RuntimePhase} phaseMeta
	 */
	constructor(simState, phaseMeta) {
		super(simState, phaseMeta);
		this.hasStarted = false;
	}

	onEnter() {
		this.log('');
		console.log('ActionCues for phase: ', this.actionCues);
		console.log('Actions for phase: ', this.nonTimeActions);
		this.uiController.setPreStartState();
		this.dskyController.setReadyState();
	}

	onTick() {
		if (this.simulationState.hasActionBeenCompleted('BEGIN_SIM')) {
			if (this.hasStarted) return;

			this.log('Intro Complete. Transitioning');
			this.hasStarted = true;
			this.simulationState.fsm?.transitionTo(PhaseIds.CSM_SEPARATION);
		}
	}

	onAction() {}

	onExit() {
		this.log('Phase: Intro complete');
	}
}
