import { jest } from '@jest/globals';

/**
 * @typedef {import('../../simulationState.js').SimulationState} SimulationState
 * @typedef {import('../../../types/runtimeTypes.js').RuntimePhase} RuntimePhase
 * @typedef {import('../../../types/runtimeTypes.js').RuntimeCue} RuntimeCue
 */

const DEFAULT_MOCK_PHASE_ID = 'test_phase';

/**
 * @param {Object} [overrides]
 * @returns {SimulationState}
 */
export function createMockSimulationState(overrides = {}) {
	const playedCues = new Set();

	/** @type {import('../../simulationState.js').SimulationState} */ const state = {
		currentPhaseId: DEFAULT_MOCK_PHASE_ID,
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

/**
 *
 * @param {Object} cueOverrides
 * @returns {RuntimeCue}
 */
export function createMockCue(cueOverrides = {}) {
	/** @type {RuntimeCue} */ const mockCue = {
		get: '000:00:00',
		getSeconds: 0,
		key: 'test_cue_01',
		data: {},
		...cueOverrides
	};
	return mockCue;
}

/**
 * @typedef {Object} Overrides
 * @property {Object} runtimeOverrides
 * @property {Object} cueOverrides
 */
/**
 *
 * @param {Overrides} [overrides]
 * @returns {RuntimePhase}
 */

export function createMockMetadata(overrides) {
	const { runtimeOverrides, cueOverrides } = overrides;
	const mockCue = createMockCue(cueOverrides);

	/** @type {RuntimePhase} */ const metaData = {
		phaseId: DEFAULT_MOCK_PHASE_ID,
		phaseName: 'Test Phase',
		description: 'Test phase used for jest testing',
		startGET: '000:00:00',
		initialState: {
			velocity: 0,
			v_units: '',
			altitude: { miles: 0, feet: 0 },
			fuel: 100
		},
		endState: {
			velocity: 0,
			v_units: '',
			altitude: { miles: 0, feet: 0 },
			fuel: 100
		},
		cuesByKey: {
			[mockCue.key]: mockCue
		},
		...runtimeOverrides
	};
	return metaData;
}
