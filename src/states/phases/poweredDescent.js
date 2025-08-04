/**
 * @typedef {import('../../types/runtimeTypes.js').RuntimeCue} Cue
 * @typedef {import('../../types/runtimeTypes.js').NonTimeAction} Action
 * @typedef {import('../../types/runtimeTypes.js').ActionEvent} ActionEvent
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 * @typedef {import('../../types/uiTypes.js').SegmentKey} SegmentKey
 */

import {
	getFromSeconds,
	getCountdownString,
	secondsFromGet
} from '../../util/GET.js';
import { BasePhase } from './basePhase.js';

export class PoweredDescent extends BasePhase {
	constructor(simState, phaseMeta) {
		super(simState, phaseMeta);
		this.keypadState = null;
		this.burnInProgress = undefined;
		this.emptyString = '00000';
	}

	onEnter() {
		this.dskyController.setInitialState();
		this.watchUntilComplete(
			action => this.handleActionEvent(action),
			cue => this.handleCueEvent(cue),
			undefined,
			undefined,
			(key, state) => {
				this.keypadState = state;
				if (key === 'key-rel') {
					this.keyRel = true;
				}
			}
		);
	}

	/**
	 *
	 * @param {ActionEvent} action
	 */
	handleActionEvent(action) {
		console.log(
			'[cue]',
			action.action,
			'TES:',
			this.simulationState?.clockControls?.clock?.secondsElapsed
		);
		if (action.actionKey === 'V37N63') {
			const onKeyRel = () => {
				this.startPreIgnition();
				this.pushButtonEmitter.off('key-rel', onKeyRel);
			};
			this.pushButtonEmitter.on('key-rel', onKeyRel);
		}
	}

	startPreIgnition() {
		this.dskyController.keyRelLight(false);
		this.setFF(undefined, '102:32:18');
		this.uiController.clearHudTranscript();
		this.uiController.updateHUD({
			transcript: 'P63 Selected. Fast Forward to next major event.'
		});

		// Any other pre-ignition logic
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
			this.dskyController.indicatorLights.flashLight('keyRelLight');
			this.dskyController.unlockKeypad();
		}

		if (cue.key === 'O_V37_N63') {
			// PROG 63, COMP-ACTY
			this.dskyController.segmentDisplays.bulkWrite({
				prog: 63,
				verb: 37,
				noun: 63
			});
		}

		if (cue.key === 'O_V00_N62') {
			this.startCountdown();
		}
	}

	startCountdown() {
		this.dskyController.lockKeypad();
		this.dskyController.segmentDisplays.write(
			/** @type {SegmentKey} */ ('prog'),
			62
		);
		this.ignitionStartGET = this.ignitionStartGET ?? secondsFromGet('102:33:08');
		this.dskyController.segmentDisplays.bulkWrite({
			verb: '06',
			noun: '62',
			r_1: this.emptyString,
			r_2: this.emptyString,
			r_3: this.emptyString
		});
		this.countdownActive = true;
		if (this.lastTickPayload) {
			this.updateCountdownTimer(this.lastTickPayload);
		}
	}

	/**
	 *
	 * @param {number} secondsRemaining
	 * @returns {boolean}
	 */
	countdownShouldBlank(secondsRemaining) {
		return secondsRemaining <= 35 && secondsRemaining > 30;
	}

	/**
	 *
	 * @param {TickPayload} tick
	 */
	updateCountdownTimer(tick) {
		const currentGET = tick.getSeconds;
		const secondsRemaining = Math.max(
			0,
			Math.round(this.ignitionStartGET - currentGET)
		);
		const countdownString = getCountdownString(secondsRemaining);

		if (this.countdownShouldBlank(secondsRemaining)) {
			this.dskyController.indicatorLights.setLight('compActy');
			this.dskyController.segmentDisplays.bulkWrite({
				p_1: ' ',
				r_1: '',
				p_2: ' ',
				r_2: '',
				p_3: ' ',
				r_3: ''
			});
		} else {
			this.dskyController.segmentDisplays.bulkWrite({
				p_2: '+',
				r_2: countdownString
			});
		}

		if (secondsRemaining <= 30) {
			this.dskyController.segmentDisplays.bulkWrite({
				noun: '62',
				verb: '06',
				r_1: this.emptyString,
				p_1: '+',
				r_2: countdownString,
				p_2: '+',
				r_3: this.emptyString,
				p_3: '+'
			});
		}
		this.ullagePrompt = false;

		if (secondsRemaining <= 7.5 && secondsRemaining > 6.5) {
			// Start ullage burn
			if (!this.ullagePrompt) {
				this.uiController.hud.renderPrompt('Ullage burn started.');
			}
		}
		if (secondsRemaining < 5.5) {
			this.dskyController.segmentDisplays.flash('verb', 99);
			this.dskyController.unlockKeypad();
			if (this.keypadState.mode === 'pro') {
				this.proceedAccepted = true;
				if (!this.dskyController.keypadLocked) this.dskyController.lockKeypad();
			}
		}

		if (secondsRemaining <= 0) {
			if (!this.proceedAccepted) {
				// failure
			}
			this.dskyController.segmentDisplays.stopFlash();
			this.countdownActive = false;
			this.burnInProgress = true;
			this.dskyController.segmentDisplays.write('p_1', '+');
		}
	}

	/**
	 *
	 * @param {TickPayload} tick
	 */
	onTick(tick) {
		if (this.countdownActive) {
			this.updateCountdownTimer(tick);
		}
	}

	/**
	 *
	 * @param {Cue} cue
	 * @param {Action} action
	 */
	triggerCueFailure(cue, action) {
		if (this.simulationState.devMode) {
			this.log(`Cue Failure triggered for ${cue.key}`, {
				actionKey: action.action,
				failsAfterGET: action.failsAfter.get,
				context: action.failsAfter.context
			});
		}

		this.simulationState.triggerInterrupt(action.failsAfter.name);

		// Modal?
		// Reset DSKY
		// Transition to FAIL???
	}

	onExit() {
		this.log('PDI completed');
	}
}
