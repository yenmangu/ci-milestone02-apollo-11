import { uiElements } from './DSKY/dskyDom.js';
import { DSKYController } from './DSKY/dskyController.js';
import { loadTimeline } from './data/timeline.js';
import { GameController } from './game/gameController.js';
import { DSKYInterface } from './DSKY/dskyInterface.js';
import { createPreStartModule } from './missionStates/preStart/index.js';
import { registerStates } from './registerStates.js';

export async function initProgram() {
	try {
		console.log('Init program initiated');

		console.log('UI Elements: ', uiElements);
		const timeline = await loadTimeline();

		const dsky = new DSKYController(uiElements);
		const dskyInterface = new DSKYInterface(dsky);
		const gameContoller = new GameController(timeline);

		dskyInterface.initiate();

		registerStates(gameContoller, dskyInterface);

		gameContoller.fsm.transitionTo('PRE_START');
		return gameContoller;
	} catch (error) {
		throw error;
	}
}
