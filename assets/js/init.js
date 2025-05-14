import { DskyRender } from './view/dskyRender.js';
import createKeypadStateManager from './keypad/keypadStateManager.js';
import { initSevenSegmentDisplay } from './seven-segment/initSevenSegment.js';
import { SevenSegmentDisplay } from './seven-segment/sevenSegment.js';
/**
 * Initialises the seven digit display and the keypad state manager factory
 */
export function initProgram() {
	try {
		const dskeyRenderer = new DskyRender();
		dskeyRenderer.setDskyStateZero();
		const dskyDisplay = new SevenSegmentDisplay(initSevenSegmentDisplay());

		const keypadStateManager = createKeypadStateManager(dskyDisplay);

		return keypadStateManager;
	} catch (error) {
		throw error;
	}
}
