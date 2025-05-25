/**
 * @typedef {Object} DevParams
 * @property {GameController} gameController
 * @property {FSM} fsm
 * @property {EventEmitter} emitter
 */

import EventEmitter from '../event/eventEmitter.js';
import { FSM } from '../FSM/fsm.js';
import { GameController } from '../game/gameController.js';

export class DevTools {
	/**
	 *
	 * @param {DevParams} param0
	 */
	constructor({ gameController, fsm, emitter }) {
		this.fsm = fsm;
		this.gameController = gameController;

		/** @type {EventEmitter}*/ this.nav = emitter;
		this.nav.subscribe(event => {
			console.log('dev event: ', event.type);

			if (event.type === 'prev' || event.type === 'next') {
				this.handleNav(event.type);
			}
		});
	}
	handleNav(direction) {
		console.log('Handle nav: ', direction);

		const states = this.fsm.factories;
		console.log('fsm factories: ', states);
		// this.fsm.transitionTo()
	}
}
