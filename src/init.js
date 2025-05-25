import { uiElements } from './DSKY/dskyDom.js';
import { DSKYController } from './DSKY/dskyController.js';
import { loadTimeline } from './data/timeline.js';
import { GameController } from './game/gameController.js';
import { DSKYInterface } from './DSKY/dskyInterface.js';
import { registerStates } from './registerStates.js';
import { InstrumentsController } from './DSKY/instruments/instrumentController.js';
import { devNavEmitter } from './event/eventBus.js';

export async function initProgram() {
	try {
		console.log('Init program initiated');

		// console.log('UI Elements: ', uiElements);
		const timeline = await loadTimeline();

		const dsky = new DSKYController(uiElements);
		const instruments = new InstrumentsController(uiElements.instrumentsMap);
		const dskyInterface = new DSKYInterface(dsky, instruments);
		const gameController = new GameController(timeline);

		dskyInterface.initiate();

		registerStates(gameController, dskyInterface);

		gameController.fsm.transitionTo('PRE_START');

		/**
		 * Inject DevTools if in dev mode
		 */
		if (
			window.location.hostname === 'localhost' ||
			window.location.hostname === '127.0.0.1' ||
			window.location.search.includes('devtools')
		) {
			console.log('Dev time!');

			const { DevTools } = await import('./dev/devTools.js');
			new DevTools({
				gameController,
				fsm: gameController.fsm,
				emitter: devNavEmitter // or however it's exposed
			});
		}

		return gameController;
	} catch (error) {
		throw error;
	}
}
