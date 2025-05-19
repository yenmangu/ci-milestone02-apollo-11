import { DskyRender } from './view/dskyRender.js';
import createKeypadStateManager from './keypad/keypadStateManager.js';
import { initSevenSegmentDisplay } from './seven-segment/initSevenSegment.js';
import { SevenSegmentDisplay } from './seven-segment/sevenSegment.js';
import { DskeyController } from './controller/dskyController.js';
import { cast } from './util/cast.js';
import { loadTimeline } from './data/timeline.js';
import { GameController } from './controller/gameController.js';
/**
 * Initialises the seven digit display and the keypad state manager factory
 */
export async function initProgram() {
	try {
		console.log('Init program initiated');
		const displayMap = initSevenSegmentDisplay();
		const dskyButtons = cast(
			Array.from(document.querySelectorAll('.push-button')),
			'nodeList'
		);
		const dsky = new DskeyController(displayMap, dskyButtons);
		dsky.initiate();

		const timeline = await loadTimeline();
		const gameContoller = new GameController(timeline);
		gameContoller.fsm.transitionTo('DESCENT_ORBIT');
		return gameContoller;
	} catch (error) {
		throw error;
	}
}
