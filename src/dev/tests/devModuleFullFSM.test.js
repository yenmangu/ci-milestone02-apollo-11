/**
 * @typedef {import("../../types/runtimeTypes.js").RuntimePhase} RuntimePhase
 * @typedef {import("../../types/runtimeTypes.js").RuntimeCue} RuntimeCue
 * @typedef {import("../../types/runtimeTypes.js").MissionTimeline} MissionTimeline
 * @typedef {import('../../states/simulationState.js').SimulationParameters} SimParams
 * @typedef {import('../../states/simulationState.js').SimulationState} SimState
 * @typedef {import('../../types/runtimeTypes.js').NonTimeAction} Action
 *
 */

import { jest, test } from '@jest/globals';
import { DevController } from '../devModule.js';
import { loadTimeline } from '../../data/loadTimeline.js';
import { createSimulationState } from '../../states/simulationState.js';
import { MissionClock } from '../../game/missionClock.js';
import { secondsFromGet } from '../../util/GET.js';
import { PhaseFSM } from '../../fsm/phaseFSM.js';
import { phaseRegistry } from '../../fsm/phaseRegistry.js';

describe('dev module with FULL FSM', () => {
	/** @type {MissionTimeline} */ let timeline;
	/** @type {PhaseFSM} */ let fsm;
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
		fsm = new PhaseFSM(simState, timeline, phaseRegistry);
		devController = new DevController(simState, fsm, missionClock, mockTimeline);

		expect(timelineSubset.length).toBe(2);
		expect(typeof timelineSubset[1].startGET).toBe('string');
	});

	test('should play cue at 102:28:08 during fast forward', () => {
		testGet = '102:28:08';
		expectedPhase = timelineSubset[1].phaseId;

		const spy = jest.spyOn(fsm, 'transitionTo');
		devController.fastForwardTo(testGet);
		expect(spy).toHaveBeenCalledWith(expectedPhase);
		console.log('[TESTING] expectedPhase: ', expectedPhase);
		console.log(
			'[TESTING] phase all cues length: ',
			timelineSubset[1].allCues.length
		);

		expect(onCuePlayedMock).toHaveBeenCalled();

		const playedGets = onCuePlayedMock.mock.calls.map(
			(/** @type {RuntimeCue[]} */ [cue]) => cue.get
		);

		console.log('[TESTING] playedGets: ', playedGets);

		expect(playedGets).toContain('102:28:08');
	});

	test('actionCues are populated after ff to a cue with requiresAction', () => {
		testGet = '102:33:09'; // the end of subset[1]

		devController.fastForwardTo(testGet);

		const actionCues = fsm.currentPhaseInstance.actionCues;

		const actions = actionCues.map(cue => cue.requiresAction);
		const gets = actionCues.map(cue => cue.get);

		console.log('[TESTING] actions: ', actions);
		console.log('[TESTING] gets: ', gets);

		expect(actions).toEqual(expect.arrayContaining(['V37N63', 'PRO']));
	});

	test('actions get completed once in simState and completeAction called', () => {
		testGet = '102:33:09';
		const actionToBeCompleted = 'V37N63';

		const spy = jest.spyOn(simState, 'completeAction');
		devController.fastForwardTo(testGet);

		expect(fsm.currentPhaseInstance.nonTimeActions.length).toBeTruthy();

		simState.completeAction(actionToBeCompleted);

		expect(spy).toHaveBeenCalled();

		expect(spy).toHaveBeenCalledWith(actionToBeCompleted);

		expect(simState.completedActions).toContain(actionToBeCompleted);

		console.log('[TESTING] simState completedActions', simState.completedActions);
	});

	test('cue action expires when timed out, and failure triggers', () => {
		testGet = '102:32:19'; // 1 second before timeout

		devController.fastForwardTo(testGet);
		const failSpy = jest.fn();
		fsm.currentPhaseInstance.triggerCueFailure = failSpy;

		missionClock.emitTicks({
			elapsedSeconds: secondsFromGet(testGet) + 1,
			getSeconds: secondsFromGet(testGet) + 1,
			getString: '102:32:20'
		});

		expect(failSpy).toHaveBeenCalledTimes(1);
		const [failedCue, failedAction] = failSpy.mock.calls[0];
		const cue = /** @type {RuntimeCue} */ (failedCue);
		const action = /** @type {Action} */ (failedAction);

		console.log('[TESTING] cue.key: ', cue.key);
		console.log('[TESTING] action.action: ', action.action);
		expect(cue.key).toBe('HUD_P63');
		expect(action.action).toBe('V37N63');
	});
});
