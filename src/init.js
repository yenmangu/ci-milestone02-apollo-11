/*
Start New Init
*/
/**
 *
 *
 * @typedef {import('./types/runtimeTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('./states/simulationState.js').SimulationState} SimState
 * @typedef {import('./states/simulationState.js').SimulationParameters} SimParams
 * @typedef {import('./types/runtimeTypes.js').RuntimePhase} RuntimePhase
 *
 *
 */

/**
 * Extend window via JSDoc for autocomplete
 * @type {Window & {dev?: DevController}}
 */

const win = window;

import { loadTimeline } from './data/loadTimeline.js';

import { createSimulationState } from './states/simulationState.js';
import { PhaseFSM } from './fsm/phaseFSM.js';
import { MissionClock } from './game/missionClock.js';
import { DevController } from './dev/devModule.js';
import { phaseRegistry } from './fsm/phaseRegistry.js';
import { PhaseIds } from './types/timelineTypes.js';
import { secondsFromGet } from './util/GET.js';
import { devNavEmitter, tickEmitter } from './event/eventBus.js';
import { queryDom } from './ui/simulationUI.js';

// just for now
let dev = true;

export async function initProgram() {
	/** @type {DevController} */ let devController;
	try {
		const initialPhaseId = PhaseIds.CSM_SEPARATION;
		/** @type {MissionTimeline} */ const timeline = await loadTimeline();
		/** @type {RuntimePhase} */ const firstPhase =
			timeline.getPhase(initialPhaseId);

		const initialGET = firstPhase.startGET;
		const initalGetSeconds = secondsFromGet(initialGET);

		/** @type {SimParams} */ const simParams = {
			initialPhaseId,
			initialGET,
			timeline,
			hooks: {
				devMode: dev
			}
		};
		/** @type {SimState} */ const simState = createSimulationState(simParams);
		/** @type {PhaseFSM} */ const fsm = new PhaseFSM(
			simState,
			timeline,
			phaseRegistry
		);

		const clock = new MissionClock(Date.now(), 1, initalGetSeconds);

		const ui = queryDom();

		tickEmitter.on('tick', tickPayload => {
			fsm.handleTick(tickPayload);
		});

		if (dev) {
			devController = new DevController(simState, fsm, clock, timeline);
			// Expose to global window object for browser testing
			win.dev = devController;
		}

		fsm.transitionTo(initialPhaseId);
		clock.start();

		// TODO Load UI Elements
		// TODO Create UI Interface
		// TODO Initiate the UI
		// TODO
	} catch (error) {}
}
