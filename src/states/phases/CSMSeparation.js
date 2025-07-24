/**
 * @typedef {import('../../types/runtimeTypes.js').RuntimeCue} RuntimeCue
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 */

import { createTag } from '../../dev/tagger.js';
import { PhaseIds } from '../../types/timelineTypes.js';
import { getFromSeconds, secondsFromGet } from '../../util/GET.js';
import { BasePhase } from './basePhase.js';

export class CSMSeparation extends BasePhase {
	constructor(simState, phaseMeta) {
		super(simState, phaseMeta);
	}
	onEnter() {
		this.watchUntilComplete(
			undefined, // action
			cue => {
				this.handleCueEvent(cue);
			}
		);

		this.setFastForwardTarget(this.phaseMeta.allCues[0].get);
	}

	/**
	 *
	 * @param {RuntimeCue} cue
	 */
	handleCueEvent(cue) {
		console.log(
			'[cue]',
			cue.key,
			'TES:',
			this.simulationState?.clockControls?.clock?.secondsElapsed
		);

		if (cue.key === 'startFF') {
			this.uiController.enableFF();
			this.ffTarget =
				secondsFromGet(this.phaseMeta.cuesByKey['ffTarget_01'].get) - 1;

			const target = getFromSeconds(this.ffTarget);
			this.setFF(60, target);
		}
		if (cue.key === 'csm_end') {
			// const tag = createTag();
			// console.log(`[csm_end] Scheduling transition (tag ${tag})`);
			setTimeout(() => {
				// console.log(`[csm_end] Timeout firing (tag ${tag})`);

				this.simulationState.fsm.transitionTo(PhaseIds.PDI);
			}, 1000);
		}
	}
	/**
	 *
	 * @param {TickPayload} tick
	 */
	onTick(tick) {
		if (tick.getSeconds >= this.ffTarget) {
			if (this.targetReached) return;
			this.uiController.disableFF();
			this.targetReached = true;
		}
	}

	onExit() {
		this.log('Phase: CSM Separation complete');
	}
}
