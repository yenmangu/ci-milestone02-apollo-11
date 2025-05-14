import { RenderDsky } from './view/dskyRender.js';
import createKeypadStateManager from './keypad/keypadStateManager.js';
import { initSevenSegmentDisplay } from './seven-segment/initSevenSegment.js';
import { SevenSegmentDisplay } from './seven-segment/sevenSegment.js';
import { initKeypadUI } from './userInput.js';
/**
 * Initialises the seven digit display and the keypad state manager factory
 */
export function initProgram() {
	try {
		const dskeyRenderer = new RenderDsky();
		dskeyRenderer.setDskyStateZero();
		const dskyDisplay = new SevenSegmentDisplay(initSevenSegmentDisplay());

		const keypadStateManager = createKeypadStateManager(dskyDisplay);

		initKeypadUI(keypadStateManager);

		return keypadStateManager;
	} catch (error) {
		throw error;
	}
}
