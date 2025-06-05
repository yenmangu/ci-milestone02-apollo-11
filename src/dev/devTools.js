/**
 * @typedef {Object} DevParams
 * @property {GameController} gameController
 * @property {FSM} fsm
 * @property {EventEmitter} emitter
 */

/**
 * @typedef {import('../types/missionTypes.js').MissionTimeline} Timeline
 * @typedef {import('../types/missionTypes.js').MissionPhase} MissionPhase
 */

import { stateEmitter } from '../event/eventBus.js';
import EventEmitter from '../event/eventEmitter.js';
import { FSM } from '../FSM/fsm.js';
import { GameController } from '../game/gameController.js';
import { MissionStateBase } from '../missionStates/missionStateBase.js';
import {
	AppStateKeys,
	AppStates,
	AppStateValuesToKeys
} from '../types/missionTypes.js';
import { cast } from '../util/cast.js';

export class DevTools {
	/** @type {number} */
	jumpSeconds;
	/**
	 *
	 * @param {DevParams} param0
	 */
	constructor({ gameController, fsm, emitter }) {
		this.fsm = fsm;
		this.gameController = gameController;

		// STATES
		this.descentOrbit = this.fsm.factories[AppStateKeys.descent_orbit];
		this.poweredDescent = this.fsm.factories[AppStateKeys.powered_descent];
		this.braking = this.fsm.factories[AppStateKeys.braking_phase];

		this.nonNavigableStates = ['FAILED', 'PAUSED'];

		this.devPanel = this.showDevPanel();
		/**
		 * @type {import('../types/missionTypes.js').AppStateKey}
		 */
		this.stateKey;
		/**
		 * @type {[key: import('../types/missionTypes.js').AppStateKey,any][]}
		 */
		this.factories = Object.entries(this.fsm.factories).map(factory => {
			const key = /** @type {import('../types/missionTypes.js').AppStateKey} */ (
				factory[0]
			);
			return [key, factory[1]];
		});

		this.currentStateIndex = this.factories.findIndex(
			([key]) => key === this.fsm.currentState.stateKey
		);

		this.timeline = null;
		/**
		 * @type {Timeline}
		 */
		this.timeline = this.gameController.timeLine;
		this.timelineMap = null;
		this.telemetryMap = null;
		this.initialiseTimeline();
		if (this.timelineMap) {
			this.initialiseTelemetryMap();
			console.log('telem map: ', this.telemetryMap);
		}

		if (this.devPanel) {
			this.collectButtons();
			this.addListeners();
			this.setStateName();
		}

		/** @type {EventEmitter}*/ this.nav = emitter;
		this.nav.subscribe(event => {
			console.log('dev event: ', event.type);

			if (event.type === 'prev' || event.type === 'next') {
				this.handleNav(event.type);
			}
		});
		/** @type {EventEmitter} */ this.stateEmitter = stateEmitter;
		this.subscribe();
		this.event = {};
	}

	initialiseTelemetryMap() {
		const telemetryMap = {};
		/** @type {Array<[string, MissionPhase]>} */
		const entries = Object.entries(this.timelineMap);
		for (const [key, value] of entries) {
			const telemetry = {
				lunar_altitude: value.lunar_altitude,
				altitude_units: value.altitude_units,
				velocity_fps: value.velocity_fps,
				fuel_percent: value.fuel_percent
			};
			telemetryMap[key] = telemetry;
		}
		this.telemetryMap = telemetryMap;
	}

	initialiseTimeline() {
		this.timeline = this.gameController.timeLine;
		if (this.timeline) {
			this.timelineMap = this.makeTimelineMap(this.timeline);
			console.log('timeline map: ', this.timelineMap);
		}
	}

	/** @param {import('../types/missionTypes.js').MissionTimeline} timeline  */
	makeTimelineMap(timeline) {
		const map = {};
		for (const [key, value] of Object.entries(AppStateKeys)) {
			const phase = timeline.getPhase(value);
			if (!phase) continue;
			const stateKey = AppStateKeys[key];
			map[stateKey] = phase;
		}
		return map;
	}

	subscribe() {
		this.stateEmitter.on('state', event => {
			console.log(`[stateEmitter]: ${event}`);
		});
		this.stateEmitter.subscribe(event => {
			console.log('[SUBSCRIBE]: ', event);
		});
	}
	setStateName() {
		console.log('[DEV]: setting state name');
		const currentStateKey = Object.entries(AppStates).find(([key]) => {
			// console.log('key: ', key);
			return key === this.fsm.currentState.stateKey;
		})?.[0];

		if (currentStateKey) {
			this.stateKey =
				/** @type {import('../types/missionTypes.js').AppStateKey} */ (
					currentStateKey
				);
			// console.log('currentStateKey found: ', currentStateKey);
			this.currentStateIndex = this.factories.findIndex(([key]) => {
				return key === currentStateKey;
			});
			document.getElementById('stateName').innerText = AppStates[this.stateKey];
		} else {
			console.warn('Could not match FSM state to known factory keys');
		}
	}

	addListeners() {
		this.prevButton.addEventListener('click', e => {
			this.handleNav('prev');
		});
		this.nextButton.addEventListener('click', e => {
			this.handleNav('next');
		});
		this.resetButton.addEventListener('click', e => {
			this.handleReset();
		});

		this.secondsInput.addEventListener('change', e => {
			e.preventDefault();
			// this.jumpSeconds = 0;
			this.jumpSeconds = this.secondsInput.valueAsNumber;
			this.jumpButton.innerText = `Jump ${this.jumpSeconds}s`;
		});
		this.jumpButton.addEventListener('click', e => {
			e.preventDefault();
			this.handleJump();
		});
	}
	handleJump() {
		console.log(`Jumping by ${this.jumpSeconds}s`);

		this.gameController.clock.jumpBy(this.jumpSeconds);
	}
	handleReset() {
		this.fsm.transitionTo(AppStateKeys.pre_start);
		this.currentStateIndex = 0;
		this.setStateName();
	}

	collectButtons() {
		this.prevButton = cast(document.querySelector('button#prevBtn'));
		this.nextButton = cast(document.querySelector('button#nextBtn'));
		this.resetButton = cast(document.querySelector('button#resetBtn'));
		/** @type  {HTMLInputElement} */
		this.secondsInput = cast(document.querySelector('input#seconds'));
		this.secondsInput.setAttribute('value', '2');
		this.jumpSeconds = this.secondsInput.valueAsNumber;
		/** @type {HTMLButtonElement} */
		this.jumpButton = document.querySelector('button#jump');
		this.jumpButton.innerText = `Jump ${this.secondsInput.value}s`;
	}

	showDevPanel() {
		const devPanel = document.createElement('section');
		devPanel.innerHTML = `
				<div class="container-fluid text-center dev-panel">
				<div class="row">
					<div class="col-6">Dev Panel</div>
					<div class="col-6" id="stateName"></div>
				</row>
					<div class="row justify-content-evenly">
						<div class="col-3">
							<button id="prevBtn"
											class="btn btn-primary">Prev</button>
						</div>
						<div class="col-3">
							<button id="resetBtn"
											class="btn btn-primary">Reset</button>
						</div>

						<div class="col-3">
							<button id="nextBtn"
											class="btn btn-primary">Next</button>
						</div>
					</div>
					<div class="row justify-content-center mt-1">
					<div class="col-2 align-self-center">
							<input id="seconds" type="number"/>
						</div>
						<div class="col-2">
							<button id="jump"
											class="btn btn-primary">Jump</button>
						</div>
					</div>
				</div>
		`;
		devPanel.id = 'devPanel';
		document.getElementById('go-back').before(devPanel);

		return devPanel;
	}

	handleNav(direction) {
		if (direction !== 'next' && direction !== 'prev') {
			return;
		}
		let newIndex = this.currentStateIndex;
		if (direction === 'next') {
			if (this.currentStateIndex >= this.factories.length - 1) {
				return;
			}
			newIndex++;
		} else if (direction === 'prev') {
			if (this.currentStateIndex <= 0) {
				return;
			}
			newIndex--;
		}

		const [newStateKey] = this.factories[newIndex];

		// Guard against transitioning to special non-mission states
		if (this.nonNavigableStates.includes(newStateKey)) {
			console.warn(`Blocked navigation to special state: ${newStateKey}`);
			return;
		}
		console.log(`${newStateKey} ${newIndex}`);

		const stateClasses = this.fsm.transitionTo(newStateKey, true);
		const { previousState, newState } = stateClasses;

		// switch (newIndex) {
		// 	case 0:
		// 		this.fsm.transitionTo(AppStateKeys.pre_start, true)
		// 		this.gameController.clock.stop();
		// 		this.gameController.clock.start();
		// 		break;
		// 	case 1:

		// }
		if (newIndex === 0) {
			this.gameController.clock.stop();
			this.gameController.clock.start();
		}

		this.currentStateIndex = newIndex;
		this.setStateName();
	}

	// transition(newStateKey, previousTelemetry = null) {
	// 	// Get copies of previous and current state class instance
	// 	// const /** @type {MissionStateBase} */ prevStateClass = this.fsm.transitionTo(
	// 	// 		newStateKey,
	// 	// 		true
	// 	// 	).prev;
	// 	// const /** @type {MissionStateBase} */ newStateClass = this.fsm.transitionTo(
	// 	// 		newStateKey,
	// 	// 		true
	// 	// ).new;

	// 	const { /** @type {MissionStateBase} */ (prev), /** @type {MissionStateBase} */ (new) } =
	// }
}
