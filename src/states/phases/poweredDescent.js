/**
 * @typedef {import('../../types/runtimeTypes.js').RuntimeCue} Cue
 * @typedef {import('../../types/runtimeTypes.js').NonTimeAction} Action
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 */

import { BasePhase } from './basePhase.js';

export class PoweredDescent extends BasePhase {
	constructor(simState, phaseMeta) {
		super(simState, phaseMeta);
	}

	onEnter() {
		this.dskyController.setInitialState();
		this.watchUntilComplete(
			action => this.handleActionEvent(action),
			cue => this.handleCueEvent(cue)
		);
	}

	/**
	 *
	 * @param {Action} action
	 */
	handleActionEvent(action) {
		console.log(
			'[cue]',
			action.action,
			'TES:',
			this.simulationState?.clockControls?.clock?.secondsElapsed
		);
	}

	/**
	 *
	 * @param {Cue} cue
	 */
	handleCueEvent(cue) {
		console.log(
			'[cue]',
			cue.key,
			'TES:',
			this.simulationState?.clockControls?.clock?.secondsElapsed
		);
		if (cue.key === 'HUD_P63') {
			// Set COMP_ACTY && KEY-REL light
			this.dskyController.indicatorLights.setActiveLights(['keyRelLight']);

			console.log('requires action');
			console.log('test');
		}

		if (cue.key === 'O_V37_N63') {
			// PROG 63, COMP-ACTY
		}

		if (cue.key === 'O_V00_N62') {
			// N62
		}
	}

	/**
	 *
	 * @param {*} tick
	 */
	onTick(tick) {}
	onExit() {
		this.log('PDI completed');
	}
}
