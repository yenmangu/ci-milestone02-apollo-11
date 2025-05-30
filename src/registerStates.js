import { DSKYInterface } from './DSKY/dskyInterface.js';
import { GameController } from './game/gameController.js';
import { createAlarm1201Module } from './missionStates/1201ProgramAlarm/index.js';
import { createAlarm1202Module } from './missionStates/1202ProgramAlarm/index.js';
import { createApproachPhaseModule } from './missionStates/approachState/index.js';
import { createBrakingPhaseModule } from './missionStates/brakingState/index.js';
import { createDescentOrbitModule } from './missionStates/descentOrbit/index.js';
import { createFailedModule } from './missionStates/failed/index.js';
import { createFinalDescentModule } from './missionStates/finalDescent/index.js';
import { createIdleModule } from './missionStates/idle/index.js';
import { createLandedModule } from './missionStates/landed/index.js';
import { MissionStateBase } from './missionStates/missionStateBase.js';
import { createPausedModule } from './missionStates/paused/index.js';
import { createPoweredDescentModule } from './missionStates/poweredDescent/index.js';
import { createPreStartModule } from './missionStates/preStart/index.js';
import { AppStateKeys } from './types/missionTypes.js';

/**
 *
 * @param {GameController} game
 * @param {DSKYInterface} dskyInterface
 */
export function registerStates(game, dskyInterface) {
	const keys = AppStateKeys;
	/**
	 * @typedef {import('./types/missionTypes.js').AppStateKey} StateKey
	 * @typedef {{view:any, controller:any, state:MissionStateBase}} StateModule
	 * @typedef {(game: GameController, dsky: DSKYInterface)=> StateModule} StateFactory
	 */

	/** @type {[StateKey,StateFactory][]} */
	const states = [
		[keys.pre_start, createPreStartModule],
		[keys.idle, createIdleModule],
		[keys.descent_orbit, createDescentOrbitModule],
		[keys.powered_descent, createPoweredDescentModule],
		[keys.braking_phase, createBrakingPhaseModule],
		[keys.program_alarm_1202, createAlarm1202Module],
		[keys.approach_phase, createApproachPhaseModule],
		[keys.program_alarm_1201, createAlarm1201Module],
		[keys.final_descent, createFinalDescentModule],
		[keys.landed, createLandedModule],
		[keys.failed, createFailedModule],
		[keys.paused, createPausedModule]
	];
	// console.log('States in registerStates: ', states);

	for (const [key, factory] of states) {
		game.fsm.registerFactory(key, () => factory(game, dskyInterface), {});
		// console.log(`State: ${key} added`);
	}
	console.log(game.fsm.factories);
}
