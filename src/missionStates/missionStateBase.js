/**
 * @template {string} T
 * @typedef {{type: T, [key: string]: any}} EventType
 */

/**
 * @typedef {{[Key in StateKey]?: {start_get: string}}} PhaseGetMap
 */

/**
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 */

/**
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 * @typedef {import('src/types/missionTypes.js').AppStateKey} StateKey
 * @typedef {import('../types/missionTypes.js').DSKYActionItem } DSKYActionItem
 * @typedef {DSKYActionItem[]} DSKYActions
 * @typedef {import('../types/dskyTypes.js').KeypadState} KeypadState
 * @typedef {import('../types/missionTypes.js').TimelineCue} TimelineCue
 * @typedef {import('src/types/missionTypes.js').TimelineCueRuntime} TimelineCueRuntime
 */

/**
 * @typedef {import('../types/missionTypes.js').DSKYActionRuntime} DSKYActionRuntime
 * @typedef {import('../types/missionTypes.js').VerbNounRuntime[]} VerbNounRuntimeArray
 * @typedef {import('../types/missionTypes.js').ProgramRuntime[]} ProgramRuntimeArray
 *
 */

/**
 * @typedef {import('../types/telemetryTypes.js').Telemetry} Telemetry
 */

import { AppStateKeys, AppStates } from '../types/missionTypes.js';

import { DSKYInterface } from '../DSKY/dskyInterface.js';
import {
	tickEmitter,
	stateEmitter,
	phaseNameEmitter,
	pushButtonEmitter,
	actionEmitter,
	telemetryEmitter
} from '../event/eventBus.js';
import EventEmitter from '../event/eventEmitter.js';
import { GameController } from '../game/gameController.js';
import { actionKeyFor } from '../util/actionKey.js';
import getSecondsFromGET from '../util/getSecondsFromGet.js';
import {
	watchPhaseAction,
	watchUntilComplete
} from '../util/watchUntilComplete.js';
import { Modal } from '../modal/modalView.js';
import { verbNounToProgramMap } from '../AGCPrograms/programMap.js';

/**
 * Creates the MissionStateBase class,
 * which has the Game Controller, DSKY Interface
 * and the state key in the contructor.
 *
 * Every state class extends this super,
 * which gives every state sub class access to this instance
 * of the Game Controller and DSKY Interface.
 * @class
 */
export class MissionStateBase {
	/**
	 * @private
	 * @static
	 * @type {PhaseGetMap}
	 */
	static _phaseGetMap;
	static _allTelemetry;

	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {StateKey} stateKey
	 */
	constructor(gameController, dskyInterface, stateKey, previousTelemetry) {
		/** @type {GameController} */ this.game = gameController;
		/** @type {DSKYInterface} */ this.dskyInterface = dskyInterface;
		/** @type {StateKey} */ this.stateKey = stateKey;
		/** @type {MissionPhase} */ this.currentPhase = null;
		/** @type {EventEmitter} */ this.stateEmitter = stateEmitter;
		/** @type {EventEmitter} */ this.phaseNameEmitter = phaseNameEmitter;
		/** @type {DSKYActionRuntime | null} */ this.dskyActions = null;
		/** @type {Map<any>} */ this.requiredActions = new Map();
		/** @type {Set<string>} */ this.actionsCompleted = new Set();
		/** @type {TimelineCueRuntime[]} */ this.timelineCues = [];
		this.transcriptCues = [];
		this.actionWatcher = null;
		this.phaseWatcher = null;
		this.phaseHeadingEl = document.getElementById('phaseName');
		this.keypadEmitter = pushButtonEmitter;
		this.actionEmitter = actionEmitter;
		this.telemetryEmitter = telemetryEmitter;
		/** @type {KeypadState | null} */ this.keypadState = null;
		this.tickEmitter = tickEmitter;
		this.lastTick = null;
		/** @type {TickPayload | null} */ this.lastTickPayload = null;
		this.tickHandler = null;
		this.verbNounToProgram = verbNounToProgramMap;
		this.runCues = true;
		/**
		 * Single point of truth for pause status.
		 * All child state classes inherit this.
		 * @type {boolean}
		 */
		this.isPaused = false;

		/**
		 * Optional hook method that can be implemented in subclasses.
		 * Called when all actions are completed
		 * @type {(() => void | undefined)}
		 */
		this.onAllCompleted = undefined;
		this.previousTelemetry = null;
		/** @type {string[]} */ this.actionKeys = [];
		/** @type {import('../types/missionTypes.js').DSKYActions} */ this.actionMetaData =
			[];

		this.modal = new Modal();

		if (!MissionStateBase._allTelemetry) {
			const telemetryMap = this.buildTelemetryMap();
			Object.freeze(telemetryMap);
			MissionStateBase._allTelemetry = telemetryMap;
		}

		if (!MissionStateBase._phaseGetMap) {
			const map = /** @type {PhaseGetMap} */ (this.buildStartGetMap());
			Object.freeze(map);
			MissionStateBase._phaseGetMap = map;
		}
		/**
		 * @type {PhaseGetMap}
		 * Expose the frozen map on every instance.
		 */
		this.phaseGetMap = MissionStateBase._phaseGetMap;
		/**
		 * @type {Object}
		 * Expose frozen telemetry map on every instance.
		 */
		this.allTelemetryValues = MissionStateBase._allTelemetry;
		this.onProgramSelected = programNumber => {
			// default: do nothing (or console.debug)
			console.debug(`Program ${programNumber} entered (no-op).`);
		};
		// this.watchUntilComplete((event) => {
		// 	if()
		// })
		this._devFastComplete = false;
	}
	buildTelemetryMap() {
		const map = {};
		for (const key of Object.values(AppStateKeys)) {
			const phase = this.game.timeLine.getPhase(key);
			if (phase) {
				const lunar_altitude = phase.lunar_altitude;
				const altitude_units = phase.altitude_units;
				const velocity_fps = phase.velocity_fps;
				const fuel_percent = phase.fuel_percent;

				Object.freeze(lunar_altitude);
				Object.freeze(altitude_units);
				Object.freeze(velocity_fps);
				Object.freeze(fuel_percent);
				map[key] = { lunar_altitude, altitude_units, velocity_fps, fuel_percent };
			}
		}
		return map;
	}

	/**
	 *
	 * @param {MissionPhase} phase
	 * 	JSON data for this phase or undefined if missing.
	 */
	onEnter(phase = null) {
		throw new Error('Subclass must implement onEnter()');
	}

	/**
	 *
	 * @protected
	 */
	watchUntilComplete(onAction, onComplete) {
		this.actionWatcher = watchUntilComplete(onAction, onComplete);
	}

	/**
	 * @protected
	 */
	watchPhaseUntilComplete(onAction) {
		this.phaseWatcher = watchPhaseAction(onAction);
	}

	/**
	 *
	 * @param {string} actionKey
	 */
	markActionComplete(actionKey) {
		// console.log('[MissionStateBase] markActionComplete(', actionKey, ')');

		this.actionsCompleted.add(actionKey);
		const requiredAction = this.requiredActions.get(actionKey);
		this.actionEmitter.emit('action', { name: actionKey, data: requiredAction });
		const allComplete = [...this.requiredActions.keys()].every(action =>
			this.actionsCompleted.has(action)
		);

		if (allComplete) {
			console.trace(`[MissionStateBase] All keys complete: for ${this.stateKey}`, [
				...this.requiredActions.keys()
			]);
			console.trace('[MissionStateBase] Completed set:', this.actionsCompleted);
			// Ignored because this is an optional hook the subclass can implement
			this.onAllCompleted?.();
		}
	}

	/**
	 *
	 * @returns {PhaseGetMap}
	 */
	buildStartGetMap() {
		/** @type {PhaseGetMap} */
		const map = {};
		for (const key of Object.values(AppStateKeys)) {
			const phase = this.game.timeLine.getPhase(key);
			if (phase && typeof phase.start_get === 'string') {
				const entry = { start_get: phase.start_get };
				Object.freeze(entry);
				map[key] = entry;
			}
		}
		Object.freeze(map);
		return map;
	}

	/**
	 *
	 * @param {Telemetry} telemetry
	 */
	setPreviousTelemetry(telemetry) {
		this.previousTelemetry = telemetry;
		this.telemetryEmitter.emit('setPrevious', telemetry);
	}

	getTelemetrySnapshot() {
		return this.telemetry;
	}

	bindTickHandler() {
		/**
		 *
		 * @param {import('../types/clockTypes.js').TickPayload} tick
		 * @returns
		 */
		this.tickHandler = tick => {
			if (this.isPaused) {
				return;
			}

			const currentGet = typeof tick === 'object' && tick?.get;
			if (currentGet == null) {
				return;
			}

			// First tick
			if (this.lastTick === null) {
				this.lastTick = currentGet;
				return;
			}

			const deltaTime = currentGet - this.lastTick;
			this.lastTick = currentGet;
			this.lastTickPayload = tick;

			this.onTickUpdate();
		};
		this.tickEmitter.on('tick', this.tickHandler);
	}

	onTickUpdate(deltaTime, getFormatted) {
		console.warn('Subclass does not implement onTickUpdate()');
	}

	unsubscribeFromTicks() {
		if (this.tickHandler) {
			this.tickEmitter.off('tick', this.tickHandler);
			this.tickHandler = null;
		}
	}

	bindKeypadStateHandler() {
		// console.trace('Binding keypad state handler');

		/**
		 *
		 * @param {import('../types/dskyTypes.js').KeypadState} state
		 */
		this.keypadStateHandler = state => {
			if (this.keypadState) {
				this.keypadState = null;
			}
			this.keypadState = state;

			this.onKeypadUpdate(state);
		};
		this.keypadEmitter.on('finalise', this.keypadStateHandler);
	}

	onKeypadUpdate(state) {
		console.warn('Subclass does not implement onKeypadUpdate()');
	}
	// Abstract Methods all child classes must implement

	/**
	 * Called by FSM when state becomes active.
	 * Fetches the JSON phase and delegates to onEnter.
	 */
	enter() {
		if (!this.game.clock.isRunning) {
			this.game.clock.resume();
		}
		// console.trace('enter being called on : ', this.stateKey);
		if (!this.game.timeLine?.getPhase) {
			console.warn(
				`Skipping enter logic: getPhase not available for state ${this.stateKey}`
			);
		}
		if (!this.stateKey) {
			console.debug('No State Key');
		}
		this.stateEmitter.emit('state', AppStates[this.stateKey]);
		const phase = this.game.timeLine.getPhase(this.stateKey);

		if (!phase) {
			this.onEnter();
		} else {
			console.log('Current phase: ', phase.phase_name);
			this.currentPhase = phase;
			this.updatePhaseHeading(phase.phase_name);
			this.onMissionCritical(phase);
			console.log(
				`⏳ OnEnter about to bind watchers for ${this.stateKey} ; requiredActions keys =`,
				[...this.requiredActions.keys()]
			);
			this.game.clock.jumpTo(this.phaseGetMap[this.stateKey].start_get);
			this.resetCues();
			this.resetDskyActions();
		}
		this.onEnter(phase);
	}
	resetDskyActions() {
		if (this.dskyActions) {
			this.dskyActions.program.forEach(program => (program.complete = false));
			this.dskyActions.verbNoun.forEach(vn => (vn.complete = false));
		}
	}
	resetCues() {
		if (this.timelineCues) {
			this.timelineCues.forEach(cue => {
				if (cue.shown) {
					cue.shown = false;
				}
			});
		}
		this.dskyInterface.hud.displayTranscript('');
	}

	updatePhaseHeading(phaseName) {
		this.phaseNameEmitter.emit('phaseName', {
			key: this.stateKey,
			name: phaseName
		});
	}

	/**
	 *
	 * @param {MissionPhase} phase
	 */
	onMissionCritical(phase) {
		const {
			start_get,
			phase_name,
			description,
			lunar_altitude,
			altitude_units,
			velocity_fps,
			fuel_percent,
			required_action,
			audio_ref,
			dsky_actions,
			state
		} = phase;

		if (phase.timeline_cues) {
			if (Array.isArray(phase.timeline_cues)) {
				this.timelineCues = phase.timeline_cues
					.filter(function (/** @type {TimelineCueRuntime} */ cue) {
						if (cue.ignore) {
							return false;
						}
						return true;
					})
					.map((/** @type {TimelineCue} */ cue, index) => {
						const seconds = getSecondsFromGET(cue.time);
						const actionKey = `cue_${index}`;
						const cueObject = {
							...cue,
							seconds,
							shown: false,
							actionKey,
							type: 'cue'
						};
						this.requiredActions.set(actionKey, cueObject);
						return cueObject;
					});

				this.timelineCues.forEach((cue, index) => {});
			}
		}

		const telemetry = {
			lunar_altitude,
			altitude_units,
			velocity_fps,
			fuel_percent,
			phase_name
		};

		// this.dskyInterface.hud.updateHud(telemetry);
		if (!this.previousTelemetry || this.previousTelemetry === null) {
			this.telemetry = { ...telemetry, state };
		} else {
			this.telemetry = {
				...this.previousTelemetry,
				state
			};
		}

		this.dskyInterface.dskyController.expectedActions = dsky_actions;
		this.dskyInterface.dskyController.requiredActions = required_action;
		this.dskyInterface.dskyController.phaseName = phase_name;
		this.dskyInterface.dskyController.phaseDescription = description;
		this.dskyInterface.dskyController.audioRef = audio_ref;
		if (phase.failure_state) {
			this.dskyInterface.dskyController.failureState = phase.failure_state;
		}
		if (Array.isArray(required_action)) {
			required_action.forEach(action => {
				this.requiredActions.set(action, action);
			});
		} else {
			if (required_action !== 'none') {
				this.requiredActions.set(required_action, required_action);
			}
		}

		if (dsky_actions && dsky_actions.length) {
			// Clear any remaining actions
			this.dskyActions = null;
			/** @type {VerbNounRuntimeArray} */ const verbNoun = [];
			/** @type {ProgramRuntimeArray} */ const program = [];
			dsky_actions.forEach((action, index) => {
				if (Array.isArray(action.program)) {
					for (const p of action.program) {
						const programObject = {
							type: 'program',
							program: p,
							complete: false
						};
						program.push(programObject);
						this.requiredActions.set(p, action.program);
					}
				} else if (typeof action.program === 'string') {
					const programObject = {
						type: 'program',
						program: action.program,
						complete: false
					};
					program.push(programObject);
					this.requiredActions.set(action.program, action.program);
				}
				if (Array.isArray(action.verb_noun)) {
					for (const pair of action.verb_noun) {
						const key = actionKeyFor(
							pair.verb,
							pair.noun,
							pair.display ? true : false
						);
						const verbNounObject = {
							type: 'verb_noun',
							verb: pair.verb,
							noun: pair.noun,
							display: pair.display ? pair.display : false,
							key: key,
							complete: false
						};
						verbNoun.push(verbNounObject);
						this.requiredActions.set(key, verbNoun);
					}
				}
			});
			this.dskyActions = { verbNoun, program };

			this.actionMetaData = dsky_actions;
		}
	}

	/**
	 *
	 * @param {KeypadState} state
	 */
	checkDSKYStatus(state) {
		console.log('Checking DSKY status');

		for (const action of this.dskyActions.verbNoun) {
			if (!action.complete) {
				if (state.noun === action.noun && state.verb === action.verb) {
					action.complete = true;
					this.markActionComplete(action.key);

					// const foundProgram = this.verbNounToProgram[action.key];
					// if (foundProgram) {
					// 	this.dskyInterface.writeProgram(foundProgram);
					// }

					// for (const pro of this.dskyActions.program) {
					// 	if (!pro.complete && pro.program === foundProgram) {
					// 		pro.complete = true;
					// 		this.onProgramSelected?.(foundProgram);
					// 		this.markActionComplete(foundProgram);
					// 	}
					// }
				}
			}
		}
	}

	checkProgramStatus(program) {
		for (const pro of this.dskyActions.program) {
			if (!pro.complete && pro.program === program) {
				const program = pro.program.slice(1);
				this.dskyInterface.writeProgram(program);
				pro.complete === true;
				this.markActionComplete(pro.program);
				return true;
			}
		}
	}

	checkTimelineCues(currentGETSeconds) {
		for (const cue of this.timelineCues) {
			if (!cue.shown && currentGETSeconds >= cue.seconds) {
				if (cue.no_display) {
				} else {
					this.runCue(cue);
				}
				cue.shown = true;
				this.markActionComplete(cue.actionKey);
			}
		}
	}
	runCue(cue) {
		if (this.runCues) {
			this.showCueOnHUD(cue);
		}
	}
	/**
	 *
	 * @param {TimelineCueRuntime} cue
	 */
	showCueOnHUD(cue) {
		const { speaker, text, time } = cue;
		const message = [`${time} ${speaker}: ${text}`];
		this.dskyInterface.hud.displayTranscript(message);
	}

	unsubscribeFromAll() {
		if (this.actionWatcher) {
			this.actionWatcher.unsubscribe();
		}
		if (this.phaseWatcher) {
			this.phaseWatcher.unsubscribe();
		}
		if (this.keypadStateHandler) {
			this.keypadEmitter.off('finalise', this.keypadStateHandler);
			this.keypadEmitter.off('keypad', this.keypadStateHandler);
			this.keypadStateHandler = null;
		}

		this.unsubscribeFromTicks();
	}

	onExit() {
		console.warn('SubClass does not implement onExit()');
	}

	exit() {
		this.unsubscribeFromAll();

		if (typeof this.onExit === 'function') {
			this.onExit();
		}
		if (this.requiredActions.size) {
			this.requiredActions.clear();
		}
	}
}
