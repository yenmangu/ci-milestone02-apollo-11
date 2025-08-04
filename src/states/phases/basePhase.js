/**
 * @typedef {import("../simulationState.js").SimulationState} SimulationState
 * @typedef {import("../../types/timelineTypes.js").PhaseId} PhaseId
 * @typedef {import("../../types/runtimeTypes.js").RuntimePhase} RuntimePhase
 * @typedef {import("../../types/runtimeTypes.js").RuntimeCue} RuntimeCue
 * @typedef {import('../../types/runtimeTypes.js').NonTimeAction} RuntimeAction
 * @typedef {import('../../types/runtimeTypes.js').ActionEvent} ActionEvent
 * @typedef {import('../../types/uiTypes.js').UIState} UIState
 * @typedef {import('../simulationState.js').UIController} UIController
 * @typedef {import('../../ui/DSKY/dskyController.js').DskyController} DSKY
 * @typedef {import('../../types/keypadTypes.js').KeypadState} KeypadState
 */

import { compareGET, secondsFromGet } from '../../util/GET.js';
import { watchUntilComplete } from '../../util/watchUntilComplete.js';
import { phaseEmitter, pushButtonEmitter } from '../../event/eventBus.js';
import { TelemetryController } from '../../telemetry/telemetryController.js';

/**
 * @typedef {import("../../types/clockTypes.js").TickPayload} TickPayload
 */

export class BasePhase {
	/**
	 *
	 * @param {SimulationState} simulationState
	 * @param {RuntimePhase} phaseMeta
	 */
	constructor(simulationState, phaseMeta) {
		this.simulationState = simulationState;
		/** @type {RuntimePhase} */ this.phaseMeta = phaseMeta;
		this.log =
			typeof simulationState.log === 'function'
				? simulationState.log
				: (msg, data) =>
						console.log(
							`[${this.phaseId}] ${msg}`,
							data ? data : 'No data supplied'
						);
		this.phaseId = phaseMeta.phaseId;
		/** @type {TickPayload} */ this.lastTickPayload = null;
		/** @type {number} */ this.currentGETSeconds;
		/** @type {number} */ this.previousGETSeconds;
		// Cues
		/** @type {RuntimeCue[]} */ this.chronologicalCues = [];
		/** @type {RuntimeCue[]} */ this.actionCues = [];
		/** @type {RuntimeCue[]} */ this.expiringCues = [];
		/** @type {RuntimeAction[]} */ this.nonTimeActions = [];
		/** @type {UIState} */ this.uiState;
		/** @type {UIController} */ this.uiController = this.simulationState?.getUI();
		if (this.uiController) {
			/** @type {DSKY} */ this.dskyController = this.uiController.dsky;
		}
		this.actionWatcher = null;
		this.pushButtonEmitter = pushButtonEmitter;
		this.keyRel = false;
		/** @type {TelemetryController | null} */ this.telemetryController = null;
	}

	enter() {
		this.keyRel = false;
		this.dskyController.indicatorLights.clearLight('keyRelLight');
		// console.log('Phase meta.allCues: ', this.phaseMeta.allCues);
		this.chronologicalCues = [...this.phaseMeta.allCues].sort((a, b) =>
			compareGET(a.get, b.get)
		);

		this.actionCues = this.getActionBoundCues();
		this.expiringCues = this.getExpiringCues();
		this.nonTimeActions = this.getNonTimeActions();
		// console.log('actionCues: ', this.actionCues);
		this.uiController.dsky.segmentDisplays.clearAll();
		this.setUiData();
		this.uiController.disableFF();

		this.telemetryController = new TelemetryController(
			this.phaseMeta.initialState,
			this.phaseMeta.endState,
			telemetry => {
				this.setUiData({
					altitude: telemetry.altitude,
					velocity: telemetry.velocity,
					vUnits: telemetry.vUnits,
					fuel: telemetry.fuel
				});
			}
		);

		if (typeof this.onEnter === 'function') {
			this.onEnter();
		}
	}

	/**
	 *
	 * @param {UIState} [data]
	 */
	setUiData(data = {}) {
		this.uiController.updateDescription(this.phaseMeta.description);

		if (!this.simulationState.showTelemetry) {
			return;
		}
		const fromTick = data ?? {};

		const { velocity, vUnits, altitude, fuel } = this.phaseMeta?.initialState ?? {};

		/** @type {UIState} */ const uiState = {
			altitude: fromTick.altitude ?? altitude,
			velocity: fromTick.velocity ?? velocity,
			vUnits: fromTick.vUnits ?? vUnits,
			fuel: fromTick.fuel ?? fuel,
			transcript: fromTick.transcript,
			prompt: fromTick.prompt,
			getStamp: fromTick.getStamp ?? this.phaseMeta?.startGET,
			phaseName: fromTick.phaseName ?? this.phaseMeta?.phaseName
		};
		this.uiState = uiState;
		this.uiController.updateHUD(uiState);
		this.uiController.clearHudTranscript();
	}

	getNonTimeActions() {
		return this.phaseMeta.nonTimeActions;
	}
	/**
	 * @returns {RuntimeCue[]}
	 */
	getExpiringCues() {
		return this.actionCues.filter(
			cue => this.getActionByKey(cue.requiresAction)?.failsAfter
		);
	}
	/**
	 *
	 * @param {string} requiresAction
	 * @returns {RuntimeAction}
	 */
	getActionByKey(requiresAction) {
		return this.nonTimeActions.find(action => action.action === requiresAction);
	}

	getActionBoundCues() {
		return this.chronologicalCues.filter(cue => cue.requiresAction);
	}

	onEnter() {
		// console.warn('Method not implemented.');
	}

	/**
	 * @protected
	 *
	 * @param {(event: ActionEvent)=> void} [onAction]
	 * @param {(event: RuntimeCue )=> void} [onCue]
	 * @param {(event: string)=> void} [onComplete]
	 * @param {(tick: TickPayload)=> void} [onTick]
	 * @param {(key: 'keypad'|'finalise'|'key-rel' , state:KeypadState)=> void} [onPushButtons]
	 */
	watchUntilComplete(
		onAction = () => {},
		onCue = () => {},
		onComplete = () => {},
		onTick = () => {},
		onPushButtons = () => {}
	) {
		if (this.actionWatcher) {
			this.actionWatcher.unsubscribe();
			this.actionWatcher = null;
		}
		this.actionWatcher = watchUntilComplete(
			onAction,
			onCue,
			onComplete,
			onTick,
			onPushButtons
		);
	}

	/**
	 *
	 * @param {TickPayload} tickPayload
	 */
	tick(tickPayload) {
		// console.log('triggering debugger at GET:', tickPayload.getString);
		// debugger;

		if (this.lastTickPayload === null) {
			this.lastTickPayload = tickPayload;
			this.previousGETSeconds = tickPayload.getSeconds;
			return;
		}

		this.lastTickPayload = tickPayload;
		this.currentGETSeconds = tickPayload.getSeconds;

		const prev = this.previousGETSeconds;
		const current = this.currentGETSeconds;

		this.previousGETSeconds = current;

		// Trigger cues whose GET matches current tick
		for (const cue of this.chronologicalCues) {
			const time = cue.getSeconds;
			if (
				time > prev &&
				time <= current &&
				!this.simulationState.hasCueBeenPlayed(cue.key)
			) {
				this.simulationState.playCue(cue);
			}
		}

		// Determine if telemetry should be displayed
		if (this.simulationState?.showTelemetry) {
			this.uiController.updateHUD(this.uiState);

			// Update Mission Clock
			this.uiController.hud.updateMissionClock(tickPayload.getString);
		}

		// Safely access the subclass methods
		if (typeof this.onTick === 'function') {
			this.onTick(tickPayload);
		}
		// Check any fails after conditions
		this.checkFailsAfter();
	}

	checkFailsAfter() {
		for (const cue of Object.values(this.phaseMeta.cuesByKey)) {
			if (!cue?.requiresAction) continue;

			/** @type {RuntimeAction | undefined} */ const action =
				this.phaseMeta.nonTimeActions.find(a => a.action === cue.requiresAction);
			if (!action?.failsAfter) continue;
			if (this.simulationState.completedActions.has(action.action)) continue;

			// console.log('[CHECK] evaluating failsAfter timeout logic');
			// console.log('[CHECK] currentGETSeconds:', this.currentGETSeconds);
			// console.log('[CHECK] failsAfterSeconds:', action.failsAfter.get);

			if (this.hasActionTimedOut(action.failsAfter.get)) {
				this.triggerCueFailure(cue, action);
			}
		}
	}

	/**
	 *
	 * @param {RuntimeCue} cue
	 * @param {RuntimeAction} action
	 */
	triggerCueFailure(cue, action) {
		// console.warn('Method not implemented.');
	}
	/**
	 *
	 * @param {number} failsAfterSeconds
	 * @returns {boolean}
	 */
	hasActionTimedOut(failsAfterSeconds) {
		// console.log('[DEBUG BasePhase] hasActionTimedOut invoked');

		if (this.currentGETSeconds >= failsAfterSeconds) {
			return true;
		}
	}

	hasCueTimedOut(cue) {}

	getCurrentGETSeconds() {
		return this.currentGETSeconds ?? 0;
	}

	/**
	 * Checks if action is required for current cue.
	 * @param {string} cueKey
	 * @returns {boolean}
	 */
	isActionRequiredForCue(cueKey) {
		const cue = this.phaseMeta.cuesByKey[cueKey];
		if (!cue || !cue.requiresAction) return false;
		return !this.simulationState.hasActionBeenCompleted(cue.requiresAction);
	}

	/**
	 * Mark a required cue action as completed.
	 * @param {string} actionKey
	 */
	completeRequiredAction(actionKey) {
		this.simulationState.completeAction(actionKey);
	}

	/**
	 *
	 * @param {TickPayload} tick
	 */
	onTick(tick) {
		// console.warn('Method not implemented.');
	}

	/**
	 *
	 * @param {{
	 * type?: 'start',
	 * interpolationStartGET?: string|number,
	 * durationSec?: number
	 * } | null} [data]
	 */
	triggerInterpolation(data = null) {
		/**
		 * @type {{ type: 'start', durationSec: number, interpolationStartGET: string|number}}
		 */
		const triggerPayload = {
			type: 'start',
			durationSec: data.durationSec ?? this.getPhaseDuration(),
			interpolationStartGET: data.interpolationStartGET ?? this.phaseMeta.startGET
		};

		phaseEmitter.emit('telemetry', triggerPayload);
	}

	stopInterpolation() {
		phaseEmitter.emit('telemetry', { type: 'stop' });
	}

	getPhaseDuration() {
		const phaseStartSec = secondsFromGet(this.phaseMeta.startGET);
		const phaseEndSec = secondsFromGet(this.phaseMeta.endGET);
		return phaseEndSec - phaseStartSec;
	}

	/**
	 *
	 * @param {number} interval
	 * @param {string} target
	 */
	setFF(interval, target) {
		this.uiController.enableFF();
		this.setFastForwardInterval(interval);
		this.setFastForwardTarget(target);
	}

	setFastForwardTarget(targetGet) {
		this.uiController.targetGet = targetGet;
	}

	/**
	 * Interval for the fast forward function
	 * @param {number} interval
	 */
	setFastForwardInterval(interval) {
		this.uiController.ffInterval = interval;
	}

	exit() {
		if (this.actionWatcher) {
			this.actionWatcher.unsubscribe();
			this.actionWatcher = null;
		}
		// Clean up instance of telemetry controller
		if (this.telemetryController) {
			this.telemetryController.exit();
			this.telemetryController = null;
		}
		if (typeof this.onExit === 'function') {
			this.onExit();
		}
	}

	onExit() {
		console.warn('Method not implemented.');
	}
}
