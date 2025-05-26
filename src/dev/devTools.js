/**
 * @typedef {Object} DevParams
 * @property {GameController} gameController
 * @property {FSM} fsm
 * @property {EventEmitter} emitter
 */

import { stateEmitter } from '../event/eventBus.js';
import EventEmitter from '../event/eventEmitter.js';
import { FSM } from '../FSM/fsm.js';
import { GameController } from '../game/gameController.js';
import { AppStateKeys } from '../types/missionTypes.js';
import { cast } from '../util/cast.js';

export class DevTools {
	/**
	 *
	 * @param {DevParams} param0
	 */
	constructor({ gameController, fsm, emitter }) {
		this.fsm = fsm;
		this.gameController = gameController;
		this.fsm.transitionTo(AppStateKeys.idle);
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
	subscribe() {
		this.stateEmitter.subscribe(event => {
			if (this.event !== event) {
				console.log('Event chage detected: ', event);

				this.event = event;
				this.setStateName();
			}
		});
	}
	setStateName() {
		this.stateKey = this.factories[this.currentStateIndex][0];
		document.getElementById('stateName').innerText = this.stateKey;
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
	}

	showDevPanel() {
		const devPanel = document.createElement('section');
		devPanel.innerHTML = `
				<div class="container-fluid text-center">
				<div class="row">
					<div class="col-6">Dev Panel</div>
					<div class="col-6" id="stateName"></div>
				</row>
					<div class="row">
						<div class="col-4">
							<button id="prevBtn"
											class="btn btn-primary">Prev</button>
						</div>
						<div class="col-4">
							<button id="resetBtn"
											class="btn btn-primary">Reset</button>
						</div>
						<div class="col-4">
							<button id="nextBtn"
											class="btn btn-primary">Next</button>
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
		this.fsm.transitionTo(newStateKey);
		this.currentStateIndex = newIndex;
		this.setStateName();
	}
}
