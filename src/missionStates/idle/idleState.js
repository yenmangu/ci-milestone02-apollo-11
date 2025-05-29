import { AppStateKeys } from '../../../src/types/missionTypes.js';
import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { MissionStateBase } from '../missionStateBase.js';
import { IdleController } from './idleController.js';
/**
 * @typedef {import('src/types/missionTypes.js').MissionPhase} MissionPhase
 */

/**
 * Represents 'IDLE' mission state
 * @extends MissionStateBase
 */
export class IdleState extends MissionStateBase {
	/**
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {IdleController} stateController
	 * @param {import('src/types/missionTypes.js').AppStateKey} key
	 */
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		/**
		 * @type {IdleController}
		 */
		this.controller = stateController;
		this.onAllCompleted = () => {
			this.game.fsm.transitionTo(AppStateKeys.descent_orbit);
		};
	}

	/**
	 * @override
	 * @param {MissionPhase} phase
	 */
	onEnter(phase) {
		this.controller.onEnter().then(() => {
			this.requiredActions = [];
			this.actionsCompleted.clear();

			this.watchUntilComplete(
				event => {},
				() => {
					console.log('Idle phase completed');
					this.onAllCompleted();
				}
			);
		});
	}

	exit() {
		console.log('Exiting idle state');
	}
	handleInput() {
		console.log('Input in IdleState detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
