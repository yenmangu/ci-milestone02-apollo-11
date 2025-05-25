import { DSKYInterface } from './DSKY/dskyInterface.js';
import { GameController } from './game/gameController.js';
import { createIdleModule } from './missionStates/idle/index.js';
import { MissionStateBase } from './missionStates/missionStateBase.js';
import { createPreStartModule } from './missionStates/preStart/index.js';
import { MissionStatesKeys } from './types/missionTypes.js';

/**
 *
 * @param {GameController} game
 * @param {DSKYInterface} dskyInterface
 */
export function registerStates(game, dskyInterface) {
	const keys = MissionStatesKeys;
	/**
	 * @typedef {import('./types/missionTypes.js').MISSION_STATES_KEYS} StateKey
	 * @typedef {{view:any, controller:any, state:MissionStateBase}} StateModule
	 * @typedef {(game: GameController, dsky: DSKYInterface)=> StateModule} StateFactory
	 */

	/** @type {[StateKey,StateFactory][]} */
	const states = [
		[keys.pre_start, createPreStartModule],
		[keys.idle, createIdleModule]
		// More to come
	];

	for (const [key, factory] of states) {
		const { view, controller, state } = factory(game, dskyInterface);
		game.fsm.addState(key, state);
		console.log(`State: ${key} added`);
	}
}
