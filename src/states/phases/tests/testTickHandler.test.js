import { jest } from '@jest/globals';
import { MissionClock } from '../../../game/missionClock.js';
import { loadTimeline } from '../../../data/loadTimeline.js';
import { PhaseFSM } from '../../../fsm/phaseFSM.js';
import { createSimulationState } from '../../simulationState.js';
import { PhaseIds } from '../../../types/timelineTypes.js';
import { BasePhase } from '../basePhase.js';

/** @type {import('../../../types/clockTypes.js').TickPayload} */ const fakeTick = {
	elapsed: 1000,
	get: 3600,
	getFormatted: '01:00:00'
};

describe('TickHandler', () => {
	/** @type {PhaseFSM} */ let fsm;
	/** @type {import('../../simulationState.js').SimulationState} */ let simulationState;

	beforeEach(async () => {
		const timeline = await loadTimeline();

		simulationState = createSimulationState({
			initialPhaseId: PhaseIds.CSM_SEPARATION,
			initialGET: '100:40:00',
			timeline,
			hooks: {
				devMode: true,
				log: jest.fn(),
				onCuePlayed: jest.fn()
			}
		});

		class MockPhase extends BasePhase {
			constructor() {
				const phaseMeta = simulationState.getPhase(PhaseIds.CSM_SEPARATION);
				super(simulationState, phaseMeta);
				this.tick = jest.fn();
			}
		}
		fsm = new PhaseFSM(simulationState, timeline, {});
		fsm.currentPhaseInstance = new MockPhase();
	});

	test('FSM receives `fakeTick` payload', () => {
		fsm.handleTick(fakeTick);
		expect(fsm.currentPhaseInstance.tick).toHaveBeenCalledTimes(1);
		expect(fsm.currentPhaseInstance.tick).toHaveBeenCalledWith(fakeTick);
	});

	test('fsm does not crash when no active phase', () => {
		// fsm.handleTick(fakeTick)
		fsm.currentPhaseInstance = null;
		expect(() => fsm.handleTick(fakeTick)).not.toThrow();
	});
});
