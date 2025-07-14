// MissionClock relies on requestAnimationFrame so this is needed for NodeJs tests

if (typeof global.requestAnimationFrame === 'undefined') {
	global.requestAnimationFrame = callback => setTimeout(callback, 0);
	global.cancelAnimationFrame = id => clearTimeout(id);
}

/**
 * @typedef {import('../../simulationState.js').SimulationState} SimState
 * @typedef {import('../../../types/runtimeTypes.js').RuntimePhase} RuntimePhase
 * @typedef {import('../../../types/runtimeTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('../../simulationState.js').SimulationParameters} SimParams
 */

import { jest } from '@jest/globals';
import { BasePhase } from '../basePhase.js';
import { loadTimeline } from '../../../data/loadTimeline.js';
import { createClockHarness } from '../../../util/testUtils/createClockHarness.js';
import { createSimulationState } from '../../simulationState.js';
import { PhaseIds } from '../../../types/timelineTypes.js';
import { getFromSeconds, secondsFromGet } from '../../../util/GET.js';
import { PhaseFSM } from '../../../fsm/phaseFSM.js';
import { phaseRegistry } from '../../../fsm/phaseRegistry.js';

/** @type {SimState} */ let simState;
/** @type {RuntimePhase} */ let runtimePhase;
/** @type {BasePhase} */ let phase;
/** @type {PhaseFSM} */ let fsm;
/** @type {ReturnType<typeof createClockHarness>} */ let clockHarness;

describe('Test phase actions against live phase', () => {
	beforeEach(async () => {
		/** @type {MissionTimeline} */ const timeline = await loadTimeline();

		runtimePhase = timeline.getPhase(PhaseIds.PDI);
		if (!runtimePhase) {
			throw new Error('No runtime phase');
		}
		/** @type {SimParams} */ const simulationParameters = {
			initialPhaseId: runtimePhase.phaseId,
			initialGET: runtimePhase.startGET,
			timeline,
			hooks: {}
		};
		simState = createSimulationState(simulationParameters);

		// simPhase = new BasePhase(simState, runtimePhase);
		// simPhase.enter();

		// setup dummy FSM with tick passthrough

		fsm = new PhaseFSM(simState, timeline, phaseRegistry);
		fsm.transitionTo(runtimePhase.phaseId);

		clockHarness = createClockHarness(fsm);

		phase = fsm.currentPhaseInstance;
	});

	afterEach(() => {
		clockHarness?.dispose();
	});

	async function advanceToGET(getString) {
		clockHarness.jumpTo(getString);
		await new Promise(r => setTimeout(r, 20));
		clockHarness.jumpBy(1);
		await new Promise(r => setTimeout(r, 20));
	}

	test('actionCues should be populated (not empty) on enter()', () => {
		expect(phase.actionCues.length).toBeGreaterThan(0);
	});

	test('check failsAfter() triggers failure when action expires via failsAfter', async () => {
		// console.log('[DEBUG] nonTimeActions: ', phase.nonTimeActions);
		debugger;
		const cueWithExpiry = phase.actionCues.find(cue => {
			const action = phase.getActionByKey(cue.requiresAction);
			return action?.failsAfter;
		});

		expect(cueWithExpiry).toBeDefined();

		const action = phase.getActionByKey(cueWithExpiry.requiresAction);

		// console.log('[DEBUG] cueWithExpiry: ', cueWithExpiry);
		// console.log('[DEBUG] action found: ', action);

		const failSpy = jest.spyOn(phase, 'triggerCueFailure');
		const lateGet = action.failsAfter.get + 1;
		await advanceToGET(getFromSeconds(lateGet));

		// console.log('[DEBUG] now:', phase.currentGETSeconds);
		// console.log('[DEBUG] failsAfter.get:', action.failsAfter.get);

		expect(failSpy).toHaveBeenCalled();
		expect(failSpy).toHaveBeenCalledWith(cueWithExpiry, action);
	});
});
