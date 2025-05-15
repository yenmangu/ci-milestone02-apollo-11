import { DskyRender } from './view/dskyRender.js';
import createKeypadStateManager from './keypad/keypadStateManager.js';
import { initSevenSegmentDisplay } from './seven-segment/initSevenSegment.js';
import { SevenSegmentDisplay } from './seven-segment/sevenSegment.js';
import { DskeyController } from './controller/dskyController.js';
import { cast } from './util/cast.js';
/**
 * Initialises the seven digit display and the keypad state manager factory
 */
export async function initProgram() {
	try {
		const displayMap = initSevenSegmentDisplay();
		const dskyButtons = cast(
			Array.from(document.querySelectorAll('.push-button')),
			'nodeList'
		);
		const dsky = new DskeyController(displayMap, dskyButtons);
		dsky.initiate();
		return dsky;
	} catch (error) {
		throw error;
	}
}
