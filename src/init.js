import { uiElements } from './DSKY/dskyDom.js';
import { DSKYController } from './DSKY/dskyController.js';
import { loadTimeline } from './data/timeline.js';
import { GameController } from './game/gameController.js';
import { DSKYInterface } from './DSKY/dskyInterface.js';
import { registerStates } from './registerStates.js';
import { HudController } from './DSKY/hud/hudController.js';
import { devNavEmitter } from './event/eventBus.js';
import { AppStateKeys } from './types/missionTypes.js';

export async function initProgram() {
	try {
		// DEV
		const dev = true;
		/**
		 * @type {import('./types/missionTypes.js').AppStateKey}
		 */
		let state = AppStateKeys.pre_start;
		if (dev) {
			state = AppStateKeys.idle;
		}

		console.log('Init program initiated');

		// console.log('UI Elements: ', uiElements);
		const timeline = await loadTimeline();

		const dsky = new DSKYController(uiElements);
		const hud = new HudController(uiElements.hudMap);
		const dskyInterface = new DSKYInterface(dsky, hud);
		const gameController = new GameController(timeline);
		gameController.start();

		dskyInterface.initiate();

		registerStates(gameController, dskyInterface);

		/**
		 * Inject DevTools if in dev mode
		 */
		gameController.fsm.transitionTo(state);

		if (dev) {
			console.log('Dev time!');

			const { DevTools } = await import('./dev/devTools.js');
			new DevTools({
				gameController,
				fsm: gameController.fsm,
				emitter: devNavEmitter
			});
		}

		return gameController;
	} catch (error) {
		throw error;
	}
}
