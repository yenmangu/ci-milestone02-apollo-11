import { DSKYInterface } from './DSKY/dskyInterface.js';
import { GameController } from './game/gameController.js';
import { createIdleModule } from './missionStates/idle/index.js';
import { MissionStateBase } from './missionStates/missionStateBase.js';
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
		[keys.idle, createIdleModule]
		// More to come
	];
	console.log('States in registerStates: ', states);

	for (const [key, factory] of states) {
		game.fsm.registerFactory(key, () => factory(game, dskyInterface));
		console.log(`State: ${key} added`);
	}
}
