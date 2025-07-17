/**
 * @typedef {import("../../types/uiTypes.js").DSKYStructure} DSKY
 * @typedef {import('../../types/keypadTypes.js').keypadStateManager} KeypadStateManager
 * @typedef {import('../../types/keypadTypes.js').DisplayInterface} DisplayInterface
 */

import { IndicatorLights } from './indicatorLights.js';
import createKeypadStateManager from './keypadStateManager.js';
import { PushButtons } from './pushButtons.js';
import { SegmentDisplay } from './segmentDisplay.js';

export class DskyController {
	/**
	 *
	 * @param {DSKY} dsky
	 */
	constructor(dsky) {
		/** @type {DSKY} */ this.dsky = dsky;
		/** @type {SegmentDisplay} */ this.segmentDisplays = new SegmentDisplay(
			dsky.segmentDisplays
		);
		/** @type {PushButtons} */ this.pushButtons = new PushButtons(dsky.pushButtons);
		/** @type {KeypadStateManager} */ this.keypad;
		/** @type {IndicatorLights} */ this.indicatorLights = new IndicatorLights(
			dsky.indicatorLights
		);
		/** @type {HTMLElement} */ this.progLight = dsky.progLight;
		this.progLightInterval = null;
		this.init();
	}
	init() {
		console.log('[DSKY CONTROLLER] init');

		this.initKeypadStateManager();
		this.initPushButtons();
	}
	initPushButtons() {
		this.pushButtons.setOnPress(key => {
			switch (key) {
				case 'VERB':
				case 'NOUN':
					this.keypad.setMode(key.toLowerCase());
					break;
				case 'CLR':
				case 'RESET':
					this.keypad.reset();
					break;
				case 'PRO':
					this.keypad.finalise();
					break;
				case '+':
				case '-':
					this.keypad.setPolarity(key === '+' ? 'plus' : 'minus');
					break;
				default:
					if (/^\d$/.test(key)) {
						this.keypad.appendDigit(key);
					}
					break;
			}
		});
	}

	initKeypadStateManager() {
		this.keypad = createKeypadStateManager({
			write: this.segmentDisplays.write.bind(this.segmentDisplays),
			bulkWrite: this.segmentDisplays.bulkWrite.bind(this.segmentDisplays),
			clearVerbNoun: this.segmentDisplays.clearVerbNoun.bind(this.segmentDisplays)
		});
	}

	setInitialState() {
		this.segmentDisplays.init();
		this.indicatorLights.clear();
		this.clearProgLight();
	}

	clearProgLight() {
		this.progLight.classList.remove('active');
	}

	setProgLight() {
		this.progLight.classList.add('active');
	}

	flashProgLight(interval = 200) {
		if (this.progLightInterval) {
			clearInterval(this.progLightInterval);
			this.clearProgLight();
		}
		this.progLightInterval = setInterval(() => {
			this.progLight.classList.toggle('active');
		}, interval);
	}
}
