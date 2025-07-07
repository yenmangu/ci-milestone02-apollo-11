import { jest } from '@jest/globals';
import { BasePhase } from '../basePhase.js';
import {
	createMockCue,
	createMockMetadata,
	createMockSimulationState
} from './mockSimulationState.js';

function fireTwoTicks(/** @type {BasePhase} */ instancePhase, overrides = {}) {
	/** @type {import('../../../types/clockTypes.js').TickPayload} */ const tickPayload =
		{
			get: overrides.get || 0,
			getFormatted: overrides.getFormatted || '000:00:00',
			elapsed: overrides.elapsed || 0
		};

	instancePhase.tick(tickPayload);
	instancePhase.tick(tickPayload);
}

describe('BasePhase cue triggering', () => {
	/** @type {import('../../simulationState.js').SimulationState} */ let simulationState;
	/** @type {import('../../../types/runtimeTypes.js').RuntimeCue} */ let cue;
	/** @type {import('../../../types/runtimeTypes.js').RuntimePhase} */ let runtimeMetaData;
	/** @type {BasePhase} */ let phase;
	/** @type {import('../../../types/clockTypes.js').TickPayload} */ let tick;

	beforeEach(() => {
		cue = createMockCue();
		simulationState = createMockSimulationState();
		const mockMeta = createMockMetadata({
			runtimeOverrides: { allCues: [cue], cuesByKey: { [cue.key]: cue } },
			cueOverrides: { cue }
		});
		// console.log('simulation state: ', simulationState);
		// console.log('runtime metadata state: ', runtimeMetaData);

		tick = {
			get: cue.getSeconds, // Numeric match
			getFormatted: cue.get,
			elapsed: cue.getSeconds
		};

		runtimeMetaData = mockMeta.metaData;

		class MockPhase extends BasePhase {
			constructor(simState, simMeta) {
				super(simState, simMeta);
			}
		}
		phase = new MockPhase(simulationState, runtimeMetaData);
		// phase.tick = jest.fn(
		// 	(/** @type {import('../../../types/clockTypes.js').TickPayload} */ tick) => {
		// 		const currentGET = tick.get;
		// 		for (const cue of phase.chronologicalCues) {
		// 			if (cue.getSeconds !== currentGET) {
		// 				continue;
		// 			}
		// 			simulationState.playCue(cue);
		// 		}
		// 	}
		// );
		jest.spyOn(phase, 'tick');
		phase.enter();
	});

	function fireTicks(
		/** @type {BasePhase} */ instancePhase = phase,
		override = {}
	) {
		const tickPayload = {
			get: cue.getSeconds, // Numeric match
			getFormatted: cue.get,
			elapsed: cue.getSeconds,
			...override
		};
		instancePhase.tick(tickPayload);
		instancePhase.tick(tickPayload); // Needs to be called twice to bypass ignore first tick logic
	}
	test('chronologicalCues to be populated', () => {
		console.log('Chrono cues: ', phase.chronologicalCues);
		// debugger;
		expect(phase.chronologicalCues.length).toBeTruthy();
		expect(phase.chronologicalCues).toContain(cue);
	});

	test('cue is triggering on matching tick', () => {
		fireTicks();

		expect(simulationState.playCue).toHaveBeenCalledWith(cue);
	});

	test('triggers playCue when tick matches cue.getSeconds', () => {
		fireTicks();
		expect(simulationState.playCue).toHaveBeenCalled();
		expect(phase.tick).toHaveBeenCalled();
	});

	test('played cues populated by cue once played', () => {
		fireTicks();
		expect(simulationState.playedCues).toContain(cue.key);
	});

	test('calls onCuePlayed hook when cue is triggered', () => {
		const mockHook = jest.fn();
		const simState = createMockSimulationState({ onCuePlayed: mockHook });
		const simPhase = new BasePhase(simState, runtimeMetaData);
		simPhase.enter();
		// phase.tick(tick);
		// phase.tick(tick);
		fireTicks(simPhase);
		expect(mockHook).toHaveBeenCalledWith(cue);
	});
});

describe('Tests cues with actions', () => {
	/** @type {import('../../../types/runtimeTypes.js').RuntimeCue} */ let cue;
	/** @type {import('../../../types/runtimeTypes.js').RuntimeCue} */ let initialCue;
	/** @type {import('../../simulationState.js').SimulationState} */ let simState;
	/** @type {import('../../../types/runtimeTypes.js').RuntimePhase} */ let simMeta;
	/** @type {BasePhase} */ let simPhase;
	/** @type {{[key:string]:string}} */ let testAction;

	beforeEach(() => {
		cue = createMockCue({
			key: 'requires_action_cue',
			requiresAction: 'test_action'
		});

		testAction = { action: 'test_action' };

		// Desctructuring the return values from the method,
		// so need to wrap the whole thing in paranthesis
		({ metaData: simMeta, initialCue: initialCue } = createMockMetadata({
			runtimeOverrides: {
				nonTimeActions: [testAction]
			},
			cueOverrides: { [cue.key]: cue }
		}));

		const hasActionBeenCompleted = jest.fn((/** @type {string} */ action) => {
			return simState.completedActions.has(action);
		});

		simState = createMockSimulationState({
			hasActionBeenCompleted,
			currentPhase: simMeta
		});
		class MockPhase extends BasePhase {
			constructor(simState, simMeta) {
				super(simState, simMeta);
			}
		}
		simPhase = new MockPhase(simState, simMeta);
	});

	test('Action completes', () => {
		expect(simState.hasActionBeenCompleted('test_action')).toBe(false);
		simState.completeAction('test_action');
		expect(simState.completedActions).toContain('test_action');
		expect(simState.hasActionBeenCompleted('test_action')).toBe(true);
	});

	test('returns true if cue has uncompleted required action', () => {
		simPhase.enter();
		expect(simPhase.isActionRequiredForCue(cue.key)).toBe(true);
	});

	test('required action is not completed on phase entry', () => {
		simPhase.enter();
		expect(simState.hasActionBeenCompleted(testAction.action)).toBe(false);
	});

	test('isActionRequiredForCue returns true when cue with actionRequired is passed', () => {
		simPhase.enter();
		expect(simPhase.isActionRequiredForCue(cue.key)).toBe(true);
		expect(simPhase.isActionRequiredForCue('test_cue_01')).toBe(false);
	});

	test('completeAction() marks it complete in simulation state', () => {
		simPhase.enter();
		simPhase.completeRequiredAction(testAction.action);
		expect(simState.hasActionBeenCompleted(testAction.action)).toBe(true);
		// debugger;
		simPhase.completeRequiredAction(cue.requiresAction);
		expect(simPhase.phaseMeta.cuesByKey[cue.key].actionCompleted).toBe(true);
		simPhase.completeRequiredAction(cue.requiresAction);
	});

	// test('Specific action should complete with required input', () => {
	// 	simPhase.enter();
	// 	simPhase.completeRequiredAction(cue.requiresAction);
	// 	expect(simState.currentPhase.cuesByKey[cue.key].actionCompleted).to;
	// });
});
