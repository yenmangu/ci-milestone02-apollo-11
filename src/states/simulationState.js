/**
 * @description
 * Simulation State
 * Holds current timeline position (GET, active phase ID)
 * Holds runtime memory (cues played, completed actions)
 * Holds methods to let phases perform side effects (play cue, trigger interrupts)
 * Logging/debugging support
 */

/**
 * @typedef {Object} SimulationState
 *
 * @property {string} currentGet - Mission time in 'HH:MM:SS' Ground Elapsed Time
 * @property {string} currentPhaseId - Id of active phaseId
 * @property {import("../types/runtimeTypes.js").RuntimePhase} currentPhase
 *
 * @property {Set<string>} playedCues
 * @property {Set<string>} completedActions
 *
 * @property {(cue: import("../types/runtimeTypes.js").RuntimeCue) => void} playCue
 * - Play a cue (updates playedCues and handles side effects)
 * @property {(action: string) => void} completeAction - Mark action as completed
 * @property {(code: string) => void} triggerInterrupt
 *
 * @property {(msg:string, data?: any) => void} [log] - Optional debug logger
 * @property {(id: string) => import("../types/runtimeTypes.js").RuntimePhase | undefined } [getPhase]
 *
 * @property {boolean} [devMode]
 *
 * @property {(cue: import("../types/runtimeTypes.js").RuntimeCue) => void} [onCuePlayed]
 */

/**
 * @typedef {Object}
 */

/**
 * @typedef {Object} SimulationParameters
 * @property {string} initialPhaseId
 * @property {string} initialGET
 * @property {import("../types/runtimeTypes.js").MissionTimeline} timeline
 * @property {Object} hooks
 */

/**
 *
 * @param {SimulationParameters} param0
 * @returns {SimulationState}
 */
function createSimulationState({ initialPhaseId, initialGET, timeline, hooks }) {
	return {
		currentPhaseId: initialPhaseId,
		currentGet: initialGET,
		currentPhase: timeline.getPhase(initialPhaseId),

		playedCues: new Set(),
		completedActions: new Set(),

		playCue(cue) {
			if (this.playedCues.has(cue.key)) return;
			this.playedCues.add(cue.key);
			hooks?.onCuePlayed?.(cue);

			this.log?.(`Cue played: ${cue.key}`, cue);
		},

		completeAction(action) {
			this.completedActions.add(action);
			this.log?.(`Action completed: ${action}`);
		},

		triggerInterrupt(code) {
			console.warn(`Interrupt triggered: ${code}`);
		},

		getPhase(id) {
			return timeline.getPhase(id);
		},

		log(msg, data) {
			hooks?.log?.(msg, data);
		},

		devMode: !!hooks?.devMode
	};
}
