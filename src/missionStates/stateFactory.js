/**
 * @template S,C,V
 * @param {new(...args: any[]) => S} StateClass
 * @param {new(view: V, dskyInterface: DSKYInterface, gameContoller: GameController) => C} ControllerClass
 * @param {new(...args: any[]) => V} ViewClass
 * @param {import("../FSM/fsm.js").AppStatesKey} key
 * @returns {(dskyInterface:any, gameController:any) => {view: V, controller: C, state: S}}
 */

import { DSKYInterface } from '../DSKY/dskyInterface.js';
import { GameController } from '../game/gameController.js';
/**
 *
 * @param {*} StateClass
 * @param {*} ControllerClass
 * @param {*} ViewClass
 * @param {import('../FSM/fsm.js').AppStatesKey} key
 * @returns
 */
export function makeModule(StateClass, ControllerClass, ViewClass, key) {
	return (dskyInterface, gameController) => {
		const view = new ViewClass();
		const controller = new ControllerClass(view, dskyInterface, gameController);
		const state = new StateClass(gameController, dskyInterface, key);
		return { view, controller, state };
	};
}
