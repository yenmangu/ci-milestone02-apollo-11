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
import { startEmitter, tickEmitter } from './event/eventBus.js';
import { queryDom } from './ui/simulationUI.js';
import { UIController } from './ui/uiController.js';
import { ClockControls } from './game/clockControls.js';

// just for now
let dev = true;

const devStartPhase = PhaseIds.PDI;

export async function initProgram() {
	/** @type {DevController} */ let devController;
	try {
		const initialPhaseId = dev ? devStartPhase : PhaseIds.INTRO;
		/** @type {MissionTimeline} */ const timeline = await loadTimeline();
		/** @type {RuntimePhase} */ const firstPhase =
			timeline.getPhase(initialPhaseId);

		const initialGET = firstPhase.startGET;
		const initalGetSeconds = secondsFromGet(initialGET);

		const uiStructure = queryDom();
		const ui = new UIController(uiStructure);

		/** @type {SimParams} */ const simParams = {
			initialPhaseId,
			initialGET,
			timeline,
			hooks: {
				devMode: dev
			},
			ui
		};
		/** @type {SimState} */ const simState = createSimulationState(simParams);
		/** @type {PhaseFSM} */ const fsm = new PhaseFSM(
			simState,
			timeline,
			phaseRegistry
		);

		// Inject after both fsm and simState have been constructed
		// Avoid circular dependency
		simState.setFSM(fsm);

		const clock = new MissionClock(Date.now(), 1, initalGetSeconds, dev);

		/** @type {ClockControls} */ const clockControls = new ClockControls(
			clock,
			fsm,
			timeline
		);

		clockControls.init();
		simState.setClockControls(clockControls);

		tickEmitter.on('tick', tickPayload => {
			fsm.handleTick(tickPayload);
		});

		if (dev) {
			devController = new DevController(
				simState,
				fsm,
				clock,
				timeline,
				uiStructure,
				ui
			);
			// Expose to global window object for browser testing
			win.dev = devController;
		}
		simState.showTelemetry = false;
		// inits ALL UI controllers frmo this one call
		ui.init();
		simState.setUI(ui);

		startEmitter.on('start', () => {
			clock.start();
			if (!simState || !clock || !fsm) {
				throw new Error('Critical error on start.');
			}
			fsm.transitionTo(initialPhaseId);
			if (dev) {
				ui.setPreStartState();
			}
		});
	} catch (error) {
		console.error('[initPogram] failed: ', error);
	}
}
