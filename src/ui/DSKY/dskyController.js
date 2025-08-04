/**
 * @typedef {import("../../types/uiTypes.js").DSKYStructure} DSKY
 * @typedef {import('../../types/keypadTypes.js').keypadStateManager} KeypadStateManager
 * @typedef {import('../../types/keypadTypes.js').DisplayInterface} DisplayInterface
 */

import { pushButtonEmitter } from '../../event/eventBus.js';
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
		this.pushButtonsEmitter = pushButtonEmitter;
		this.pushButtonsEmitter.on('key-rel', () => {
			this.indicatorLights.clearLight('keyRelLight');
		});
		this.pushButtonsEmitter.on('op-err', () => {
			this.indicatorLights.setLight('opErrLight');
		});
		this.pushButtonsEmitter.on('cancel-err', () => {
			this.indicatorLights.clearLight('opErrLight');
		});
		this.keypadLocked = false;
		this.init();
	}
	init() {
		console.log('[DSKY CONTROLLER] init');

		this.initKeypadStateManager();
		this.initPushButtons();
		this.lockKeypad();
		this.segmentDisplays.init();
		pushButtonEmitter;
	}
	initPushButtons() {
		this.pushButtons.setOnPress(key => {
			console.log('Key: ', key);

			switch (key) {
				case 'verb':
				case 'noun':
				case 'pro':
					this.keypad.setMode(key.toLowerCase());
					break;
				case 'clr':
				case 'rset':
					this.keypad.reset();
					break;
				case 'entr':
					this.keypad.finalise();
					break;
				case '+':
				case '-':
					this.keypad.setPolarity(key === '+' ? 'plus' : 'minus');
					break;
				case 'key-rel':
					this.keypad.keyRel();
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
		this.clearProgLight();
	}

	setZeroState() {
		this.segmentDisplays.clearAll();
	}

	setReadyState() {
		this.segmentDisplays.setReady();
		this.indicatorLights.clearAll();
	}

	lockKeypad() {
		if (!this.keypadLocked) {
			this.pushButtons.lock();
			this.keypadLocked = true;
		}
	}
	unlockKeypad() {
		if (!this.keypadLocked) {
			this.pushButtons.unlock();
			this.keypadLocked = false;
		}
	}

	clearProgLight() {
		this.progLight.classList.remove('active');
	}

	setProgLight() {
		this.progLight.classList.add('active');
	}

	/**
	 * Wrapper to operate key release light.
	 * Default behaviour flashes light.
	 * Pass 'flash = false' to stop flashing.
	 *
	 * @param {boolean} [flash]
	 */
	keyRelLight(flash = true) {
		if (flash) {
			this.indicatorLights.flashLight('keyRelLight');
		} else {
			{
				this.indicatorLights.clearLight('keyRelLight');
			}
		}
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
