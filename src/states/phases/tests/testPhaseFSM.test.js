import { jest } from '@jest/globals';
import { loadTimeline } from '../../../data/loadTimeline.js';
import { PhaseFSM } from '../../../fsm/phaseFSM.js';
import { phaseRegistry } from '../../../fsm/phaseRegistry.js';
import { createSimulationState } from '../../simulationState.js';
import { PhaseIds } from '../../../types/timelineTypes.js';

describe('PhaseFSM', () => {
	/** @type {PhaseFSM} */ let fsm;
	let simulationState;
	let logMock;

	beforeEach(async () => {
		const timeline = await loadTimeline();
		logMock = jest.fn();
		if (timeline) {
			simulationState = createSimulationState({
				initialPhaseId: PhaseIds.CSM_SEPARATION,
				initialGET: '100:40:00',
				timeline: timeline,
				hooks: {
					log: logMock,
					onCuePlayed: jest.fn(),
					devMode: true
				}
			});
			fsm = new PhaseFSM(simulationState, timeline, phaseRegistry);
		}
	});

	test('transitions to CSM and calls onEnter()', () => {
		fsm.transitionTo(PhaseIds.CSM_SEPARATION);
		expect(fsm.currentPhaseId).toBe(PhaseIds.CSM_SEPARATION);
		expect(logMock).toHaveBeenCalled();
		expect(logMock).toHaveBeenCalledWith('Phase: CSM Separation');
	});
});
