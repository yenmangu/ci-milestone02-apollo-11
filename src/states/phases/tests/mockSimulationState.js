import { jest } from '@jest/globals';

/**
 * @param {Object} [overrides]
 * @returns {import('../../simulationState.js').SimulationState}
 */
export function createMockSimulationState(overrides = {}) {
	const playedCues = new Set();

	/** @type {import('../../simulationState.js').SimulationState} */ const state = {
		currentPhaseId: 'test_phase',
		currentGet: '000:00:00',
		currentPhase: null,
		playedCues,
		completedActions: new Set(),

		hasCueBeenPlayed: jest.fn(key => playedCues.has(key)),
		markCuePlayed: jest.fn(key => playedCues.add(key)),
		playCue: jest.fn((/** @type {import('../basePhase.js').RuntimeCue} */ cue) => {
			if (playedCues.has(cue.key)) return;
			playedCues.add(cue.key);
			state.log?.(`Cue played: ${cue.key}`, cue);
		}),

		onCuePlayed: jest.fn(),
		completeAction: jest.fn(),

		getPhase: jest.fn(() => null),
		devMode: false,
		...overrides
	};
	return state;
}
