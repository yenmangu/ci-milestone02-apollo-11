import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { actionEmitter } from '../../event/eventBus.js';
import { GameController } from '../../game/gameController.js';
import { AppStateKeys } from '../../types/missionTypes.js';
import { MissionStateBase } from '../missionStateBase.js';
import { DescentOrbitController } from './descentOrbitController.js';

export class DescentOrbitState extends MissionStateBase {
	/**
	 *
	 * @param {GameController} gameController
	 * @param {DSKYInterface} dskyInterface
	 * @param {DescentOrbitController} stateController
	 * @param {import('../../types/missionTypes.js').AppStateKey} key
	 */
	constructor(gameController, dskyInterface, stateController, key) {
		super(gameController, dskyInterface, key);
		this.controller = stateController;
		this.onAllCompleted = () => {
			this.game.fsm.transitionTo(AppStateKeys.powered_descent);
		};
	}

	// Defining the callback needed for the handleActionEvent

	onEnter() {
		this.watchUntilComplete(
			event => this.handleActionEvent(event),
			event => {
				console.log('Descent Orbit actions completed');
				this.game.fsm.transitionTo(AppStateKeys.powered_descent);
			}
		);
		this.controller.view.showPhaseIntro();
		this.controller.view.enableUserInput();
	}

	handleActionEvent(event) {
		console.log('Event being handled: ', event);
		if (!event.action) {
			return;
		}
		if (this.requiredActions.includes(event.action)) {
			this.markActionComplete(event.action);
		}
	}

	exit() {
		super.exit();
		console.log('Exiting DescentOrbit state');
	}
	handleInput() {
		console.log('Input in DescentOrbit detected');
	}

	update(deltaTime) {
		// Use superclass method to check pause
		super.update(deltaTime);
	}
}
