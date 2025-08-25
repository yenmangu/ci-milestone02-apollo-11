/**
 * @typedef {import('../../types/runtimeTypes.js').RuntimeCue} RuntimeCue
 * @typedef {import('../../types/runtimeTypes.js').ActionEvent} Action
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 * @typedef {import('../../types/keypadTypes.js').KeypadState} KeypadState
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
			action => {
				this.handleAction(action);
			}, // action
			cue => {
				this.handleCueEvent(cue);
			},
			undefined,
			undefined,
			(event, state) => {
				this.handleKeypad(event, state);
			}
		);

		this.setFastForwardTarget(this.phaseMeta.allCues[0].get);
	}

	/**
	 *
	 * @param {Action} action
	 */
	handleAction(action) {
		console.log('handling action with: ', action);

		if (action.actionKey === 'CSM_PRO') {
			this.onReadyToTransition();
			this.dskyController.lockKeypad();
		}
	}

	/**
	 *
	 * @param {'key-rel'|'finalise'|'opp-err'|'keypad'} event
	 * @param {KeypadState} state
	 */
	handleKeypad(event, state) {
		if (event === 'keypad' && state.mode === 'pro') {
			this.simulationState.completeAction('CSM_PRO');
		}
	}

	/**
	 *
	 * @param {RuntimeCue} cue
	 */
	handleCueEvent(cue) {
		if (cue.key === 'startFF') {
			// this.uiController.enableFF();
			this.ffTarget =
				secondsFromGet(this.phaseMeta.cuesByKey['ffTarget_01'].get) - 1;

			const target = getFromSeconds(this.ffTarget);
			this.setFF(60, target);
		}
		if (cue.key === 'pro') {
			this.dskyController.unlockKeypad();
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

	async onReadyToTransition() {
		console.log('ready to transition');

		const endGet = this.phaseMeta.endGET;
		const targetGet = getFromSeconds(secondsFromGet(endGet) - 1);

		this.setFF(1, targetGet);
		await this.simulationState.clockControls.fastJump(targetGet);
		this.uiController.disableFF();
		setTimeout(() => {
			this.simulationState.fsm.transitionTo(PhaseIds.PDI);
		}, 1000);
	}

	onExit() {
		// this.log('Phase: CSM Separation complete');
	}
}
