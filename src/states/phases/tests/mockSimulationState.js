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

	/** @type {import('../../simulationState.js').SimulationState} */
	const state = {
		currentPhaseId: DEFAULT_MOCK_PHASE_ID,
		currentGet: '000:00:00',
		currentPhase: null,
		playedCues,
		completedActions: new Set(),

		hasCueBeenPlayed: jest.fn(key => playedCues.has(key)),
		markCuePlayed: jest.fn(key => playedCues.add(key)),
		playCue: undefined,
		hasActionBeenCompleted: action => {
			return state.completedActions.has(action);
		},
		onCuePlayed: jest.fn(),
		completeAction: action => {
			state.completedActions.add(action);
			state.completeCueAction(action);
		},
		completeCueAction(actionKey) {
			for (const cue of Object.values(this.currentPhase.cuesByKey)) {
				console.log('Cue in completeCueAction: ', cue);
				console.log('actionKey provided to function: ', actionKey);
				if (cue.requiresAction === actionKey) {
					console.log('requires action cue: ', cue);
					cue.actionCompleted = true;
					console.log('Cue after marking action complete: ', cue);
				}
			}
		},

		getPhase: jest.fn(() => null),
		devMode: false,
		...overrides
	};
	state.playCue = jest.fn(
		(/** @type {import('../basePhase.js').RuntimeCue} */ cue) => {
			if (playedCues.has(cue.key)) return;
			playedCues.add(cue.key);
			state.onCuePlayed?.(cue);
			state.log?.(`Cue played: ${cue.key}`, cue);
		}
	);

	// console.log('State after overrides: ', state);

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
 * Factory function to provide mock metadata and mock cue for phase testing
 * @param {Overrides} [overrides]
 * @returns {{metaData: RuntimePhase, initialCue: RuntimeCue}}
 */

export function createMockMetadata(overrides) {
	// Destructure the parameter with default values
	const { runtimeOverrides = {}, cueOverrides = {} } = overrides;

	console.log('cueOverrides received: ', cueOverrides);
	console.log('cueOverrides keys: ', Object.keys(cueOverrides));

	// Ensure that both arrays and objects of cues can be passed
	/** @type {RuntimeCue[]} */ const cues = Array.isArray(cueOverrides)
		? cueOverrides
		: Object.values(cueOverrides);

	const initialCue = createMockCue();
	/** @type {RuntimeCue[]} */ const cueList = [initialCue];

	// Initialise cue map with initialCue
	/** @type {{[key: string ]: RuntimeCue}} */ const cueMap = {
		[cueList[0].key]: cueList[0]
	};

	// Add any additional cues passed in cueOverrides
	cues.forEach((/** @type {RuntimeCue} */ cue) => {
		cueList.push(cue);
		cueMap[cue.key] = cue;
	});

	// Build the mock meta data
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
		allCues: cueList,
		cuesByKey: cueMap,
		...runtimeOverrides
	};
	return { metaData, initialCue };
}
