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
		this.keyRelPressed = false;
	}

	onEnter() {
		this.log('');
		console.log('ActionCues for phase: ', this.actionCues);
		console.log('Actions for phase: ', this.nonTimeActions);
		this.uiController.setPreStartState();
		this.dskyController.setReadyState();
		this.watchUntilComplete(
			action => {
				() => {};
			},
			cue => {
				this.handleCueEvent(cue);
			},
			undefined,
			undefined,
			key => {
				if (key === 'key-rel') {
					this.keyRelPressed = true;
				}
			}
		);
	}
	handleCueEvent(cue) {
		console.log('Cue Event', cue);
		if (cue.key === 'intro_09') {
			this.dskyController.unlockKeypad();

			this.dskyController.indicatorLights.flashLight('keyRelLight');
		}
	}

	handleActionEvent(event) {
		console.log('Handle Action Event: ', event);
	}

	onTick() {
		if (this.simulationState.hasActionBeenCompleted('BEGIN_SIM')) {
			if (this.hasStarted) return;
			if (!this.keyRelPressed) return;

			this.log('Intro Complete. Transitioning');
			this.hasStarted = true;
			this.simulationState.fsm?.transitionTo(PhaseIds.CSM_SEPARATION);
		}
	}

	async showIntroModal() {
		this.simulationState.fsm?.transitionTo(PhaseIds.CSM_SEPARATION);
	}

	onAction() {}

	onExit() {
		this.log('Phase: Intro complete');
	}
}
