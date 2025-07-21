/**
 * @typedef {import("../types/timelineTypes.js").JSON_NonTimeAction} Action
 * @typedef {import('../ui/uiController.js').UIController} UIController
 * @typedef {import('../fsm/phaseFSM.js').PhaseFSM} PhaseFSM
 * @typedef {import('../types/keypadTypes.js').KeypadState} KeypadState
 */

import {
	actionEmitter,
	pushButtonEmitter,
	startEmitter
} from '../event/eventBus.js';

/**
 *
 * @typedef {Object} SimulationState
 * @property {string} currentGet - Mission time in 'HH:MM:SS' Ground Elapsed Time
 * @property {string} currentPhaseId - Id of active phaseId
 * @property {import("../types/runtimeTypes.js").RuntimePhase} currentPhase
 *
 * @property {Set<string>} playedCues
 * @property {Set<string>} completedActions
 *
 * @property {PhaseFSM} [fsm]
 * @property {(fsm: PhaseFSM) => void} [setFSM]
 *
 * @property {UIController | null} [ui]
 * @property {(ui: UIController) => void} [setUI]
 * @property {() => UIController} [getUI]
 *
 * @property {(cue: import("../types/runtimeTypes.js").RuntimeCue) => void} playCue
 * - Play a cue (updates playedCues and handles side effects)
 * @property {(cueKey: string) => boolean} [hasCueBeenPlayed]
 * @property {(cueKey: string) => void} markCuePlayed
 * @property {(cue: import("../types/runtimeTypes.js").RuntimeCue) => void} dispatchCue
 * @property {(actionKey: string) => void} completeAction - Mark action as completed
 * @property {(actionKey: string) => boolean } hasActionBeenCompleted
 * @property {(cueKey: string) => void} completeCueAction - Mark cue action as completed
 * @property {(code: string) => void} triggerInterrupt
 *
 * @property {(msg:string, data?: any) => void} [log] - Optional debug logger
 * @property {(id: string) => import("../types/runtimeTypes.js").RuntimePhase | undefined } [getPhase]
 *
 * @property {boolean} [showTelemetry]
 * @property {(keypadState: KeypadState) => void} [receiveDskyCommand]
 * @property {boolean} [devMode]
 *
 * @property {(cue: import("../types/runtimeTypes.js").RuntimeCue) => void} onCuePlayed
 */

/**
 * @typedef {Object} SimulationHooks
 * @property {(cue: import('../types/runtimeTypes.js').RuntimeCue) => void} [onCuePlayed]
 * @property {(msg:string, data: any) => void} [log]
 * @property {boolean} [devMode]
 */

/**
 * @typedef {Object} SimulationParameters
 * @property {string} initialPhaseId
 * @property {string} initialGET
 * @property {import("../types/runtimeTypes.js").MissionTimeline} timeline
 * @property {SimulationHooks} hooks
 * @property {UIController} [ui]
 */

const dskyCommandMap = {
	V37N99: 'BEGIN_SIM',
	V37N63: 'V37N63',
	PRO: 'pro'
};

/**
 * @description
 * SimulationState
 * - Holds current timeline position (GET, active phase ID)
 * - Holds runtime memory (cues played, completed actions)
 * - Holds methods to let phases perform side effects (play cue, trigger interrupts)
 * - Logging/debugging support
 * @param {SimulationParameters} simulationParameters
 * @returns {SimulationState}
 */

function createSimulationState({
	initialPhaseId,
	initialGET,
	timeline,
	hooks,
	ui
}) {
	const state = {
		currentPhaseId: initialPhaseId,
		currentGet: initialGET,
		currentPhase: timeline.getPhase(initialPhaseId),

		playedCues: new Set(),
		completedActions: new Set(),
		showTelemetry: true,
		ui,

		setFSM(fsmInstance) {
			this.fsm = fsmInstance;
		},

		setUI(uiInstance) {
			this.ui = uiInstance;
		},

		getUI() {
			if (this.ui) {
				return this.ui;
			}
		},

		onCuePlayed: hooks?.onCuePlayed,
		log: hooks?.log || console.log,
		devMode: !!hooks?.devMode,

		playCue(cue) {
			if (this.hasCueBeenPlayed(cue.key)) return;
			this.dispatchCue(cue);
			const { key } = cue;
			actionEmitter.emit('cue', { key: key, cue });
			this.markCuePlayed(cue.key);
		},

		hasCueBeenPlayed(cueKey) {
			return this.playedCues.has(cueKey);
		},

		markCuePlayed(cueKey) {
			this.playedCues.add(cueKey);
		},

		dispatchCue(cue) {
			console.log('Dispatching cue: ', cue);
			console.log('Current GET: ', this.currentGet);

			this.onCuePlayed?.(cue);
			if (this.ui && typeof ui.routeCue === 'function') {
				this.ui.routeCue(cue);
			}
			this.log?.(`Cue dispatched:  ${cue.key}`, cue);
		},

		/**
		 *
		 * @param {KeypadState} keypadState
		 */
		receiveDskyCommand(keypadState) {
			this.log('Receiving DSKY command');
			const { verb, noun } = keypadState;
			const command = `V${verb}N${noun}`;
			const actionId = dskyCommandMap[command] ?? command;
			this.log(`[SimulationState] Received DSKY input: `, command);

			const match = Object.values(state.currentPhase.cuesByKey).find(
				cue =>
					cue.requiresAction === actionId && !state.hasActionBeenCompleted(actionId)
			);

			if (match) {
				// log()
				state.log(`[SimulationState] Found matching cue action: ${match.key}`);
				state.completeAction(actionId);
			} else {
				state.log(`[SimulationState] No matching action for ${command}`);
			}
		},

		/**
		 *
		 * @param {string} actionKey
		 */
		completeAction(actionKey) {
			this.completedActions.add(actionKey);
			this.completeCueAction(actionKey);
			this.log?.(`Action completed: ${actionKey}`);
		},

		hasActionBeenCompleted(actionKey) {
			return this.completedActions.has(actionKey);
		},

		completeCueAction(actionKey) {
			for (const cue of Object.values(this.currentPhase.cuesByKey)) {
				if (cue.requiresAction === actionKey) {
					const action = this.completedActions[actionKey];
					actionEmitter.emit('action', { key: actionKey, action, cue });
					cue.actionCompleted = true;
				}
			}
		},

		triggerInterrupt(code) {
			console.warn(`Interrupt triggered: ${code}`);
		},

		getPhase(id) {
			return timeline.getPhase(id);
		}
	};

	pushButtonEmitter.on('finalise', keypadState =>
		state.receiveDskyCommand(keypadState)
	);
	return state;
}

export { createSimulationState };
