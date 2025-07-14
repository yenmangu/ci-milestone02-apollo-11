/**
 * @typedef {import('../../types/runtimeTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('../../types/runtimeTypes.js').RuntimePhase} RuntimePhase
 * @typedef {import('../../states/simulationState.js').SimulationParameters} SimParams
 * @typedef {import('../../states/simulationState.js').SimulationState} SimState
 * @typedef {MissionClock}
 * @typedef {import('../devModule.js').PartialFSM} PartialFSM
 * @typedef {import('../../types/runtimeTypes.js').RuntimeCue} RuntimeCue
 *
 */

// /**
//  * @typedef {SimState | {onCuePlayed: () => }} PartialSimState
//  */

import { jest } from '@jest/globals';
import { DevController } from '../devModule.js';
import { loadTimeline } from '../../data/loadTimeline.js';
import { createSimulationState } from '../../states/simulationState.js';
import { MissionClock } from '../../game/missionClock.js';
import { secondsFromGet } from '../../util/GET.js';

describe('Dev module time skipping should work seamlessly', () => {
	/** @type {MissionTimeline} */ let timeline;
	/** @type {PartialFSM} */ let fsm;
	/** @type {MissionClock} */ let missionClock;
	/** @type {DevController} */ let devController;
	/** @type {RuntimePhase[] } */ let timelineSubset;
	/** @type {SimState} */ let simState;
	/** @type {jest.Mock} */ let onCuePlayedMock;

	let testGet;
	let expectedPhase;

	beforeEach(async () => {
		timeline = await loadTimeline();
		const { runtimePhases } = timeline;
		timelineSubset = [runtimePhases[0], runtimePhases[1]];
		/** @type {MissionTimeline} */ const mockTimeline = {
			runtimePhases: timelineSubset,
			metadata: timeline.metadata,
			getPhase: timeline.getPhase
		};

		onCuePlayedMock = jest.fn();

		/** @type {SimParams} */ const simParams = {
			initialPhaseId: timelineSubset[0].phaseId,
			initialGET: timelineSubset[0].startGET,
			timeline: mockTimeline,
			hooks: {
				onCuePlayed: onCuePlayedMock
			}
		};
		const initialGetSeconds = secondsFromGet(simParams.initialGET);
		missionClock = new MissionClock(Date.now(), 1, initialGetSeconds);
		missionClock.lastRealTime = Date.now();
		missionClock._loop = jest.fn();
		simState = createSimulationState(simParams);
		fsm = { transitionTo: jest.fn() };
		devController = new DevController(simState, fsm, missionClock, mockTimeline);

		expect(timelineSubset.length).toBe(2);
		expect(typeof timelineSubset[1].startGET).toBe('string');
	});

	test(`fsm.transitionTo to have been called
		when transitioning to a get string in
		timerange of timelineSubset[1]`, () => {
		testGet = '102:33:09';
		expectedPhase = timelineSubset[1].phaseId;
		devController.fastForwardTo(testGet);

		console.log('[TESTING] expectedPhase from 102:33:10: ', expectedPhase);

		expect(fsm.transitionTo).toHaveBeenCalled();
		expect(fsm.transitionTo).toHaveBeenCalledWith(expectedPhase);
	});

	test(`fsm.transitionTo to have been called
		when transitioning to a get string in
		timerange of timelineSubset[0]`, () => {
		testGet = '100:40:36';
		expectedPhase = timelineSubset[0].phaseId;
		devController.fastForwardTo(testGet);

		console.log('[TESTING] expectedPhase from 100:40:36: ', expectedPhase);

		expect(fsm.transitionTo).toHaveBeenCalled();
		expect(fsm.transitionTo).toHaveBeenCalledWith(expectedPhase);
	});

	// THE following will not work because we need a full FSM not partial

	// test('cue playback assertions when transitionTo is called', () => {
	// 	testGet = '100:40:36';

	// 	expectedPhase = timelineSubset[0].phaseId;
	// 	devController.fastForwardTo(testGet);

	// 	expect(fsm.transitionTo).toHaveBeenCalledWith(expectedPhase);
	// 	console.log('[TESTING] expectedPhase: ', expectedPhase);
	// 	console.log(
	// 		'[TESTING] phase all cues length: ',
	// 		timelineSubset[0].allCues.length
	// 	);

	// 	expect(onCuePlayedMock).toHaveBeenCalled();

	// 	const calls = onCuePlayedMock.mock.calls;
	// 	const playedGets = calls.map((/** @type {RuntimeCue[]} */ [cue]) => cue.get);

	// 	expect(playedGets).toContain('102:33:08');
	// });
});
