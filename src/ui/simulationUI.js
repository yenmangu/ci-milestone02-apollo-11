/**
 * @typedef {import('../types/uiTypes.js').UIStructure} UIStructure
 * @typedef {import('../types/uiTypes.js').SegmentMap} SegmentMap
 * @typedef {import('../types/uiTypes.js').HudElKey} HudElKey
 * @typedef {import('../types/uiTypes.js').Controls} Controls
 * @typedef {import('../types/uiTypes.js').IndicatorLights} Lights
 */

import { cast } from '../util/cast.js';
import { segmentKeys } from '../types/uiTypes.js';
import { getHudKey } from '../util/uiKeys.js';

/**
 *
 * @returns {Controls}
 */
function initControls() {
	/** @type {Controls} */ const map = {};
	map.start = /** @type {HTMLButtonElement} */ (
		document.getElementById('startBtn')
	);
	map.playPause = /** @type {HTMLButtonElement} */ (
		document.getElementById('playPause')
	);
	map.fastForward = /** @type {HTMLButtonElement} */ (
		document.getElementById('ff')
	);
	return map;
}

/**
 *
 * @returns {import('../types/uiTypes.js').SegmentMap}
 */
function initSevenSegmentDisplay() {
	/** @type {Partial<SegmentMap>} */ const map = {};

	document.querySelectorAll('.seven-segment span[id]').forEach(el => {
		// console.log('found segment: ', el);
		const castEl = cast(el);
		map[castEl.id] = castEl;
	});

	segmentKeys.forEach(key => {
		if (!map[key]) {
			console.warn(`Missing segment element: ${key}`);
		}
	});

	return /** @type {SegmentMap} */ (map);
}

/**
 * @returns {import('../types/uiTypes.js').PushButtonsMap}
 */
function initPushButtons() {
	/** @type {Object.<string, HTMLButtonElement>} */
	const map = Array.from(document.querySelectorAll('.push-button')).reduce(
		(map, el) => {
			/** @type {HTMLButtonElement} */ const castEl = cast(
				/** @type {HTMLButtonElement} */ el
				// 'element'
			);
			const key = castEl.dataset.dsky;
			map[key] = castEl;
			return map;
		},
		{}
	);
	return map;
}

/**
 * @returns {import('../types/uiTypes.js').IndicatorLightsMap}
 */
function initLightsMap() {
	/** @type {Object.<string, HTMLElement>} */
	const map = Array.from(document.querySelectorAll('.col.light')).reduce(
		(map, el) => {
			/** @type {HTMLElement} */ const castEl = cast(/** @type {HTMLElement} */ el);
			const key = castEl.id;
			map[key] = castEl;
			return map;
		},
		{}
	);
	return map;
}

/**
 *
 * @returns {any}
 */
function initSections() {
	const map = Array.from(document.querySelectorAll('section[id$=-ui]')).reduce(
		(map, el) => {
			const castEl = cast(el);
			const key = el.id.slice(0, el.id.indexOf('-'));
			map[key] = castEl;
			return map;
		},
		{}
	);
	console.log('map', map);

	return map;
}

/**
 *
 * @returns {UIStructure}
 */
function queryDom() {
	const controls = initControls();

	const indicatorLights = initLightsMap();

	const progLight = cast(document.getElementById('compActy'));
	if (!progLight) {
		throw new Error('Error missing progLight in UI elements');
	}

	const segmentDisplays = initSevenSegmentDisplay();

	const pushButtons = initPushButtons();
	if (!pushButtons) {
		throw new Error('Missing pushButtons in UI elements');
	}

	const sections = initSections();
	if (!sections) {
		throw new Error('Missing sections in UI Elements');
	}

	/** @type {any} */
	const hudMap = Array.from(document.querySelectorAll('span[id^="hud-"]')).reduce(
		(map, element) => {
			const key = getHudKey(/** @type {HudElKey} */ (element.id));
			map[key] = cast(element);
			return map;
		},
		{}
	);
	console.log('HudMap: ', hudMap);

	const requiredHudKeys = [
		'altUnits',
		'altitude',
		'velocity',
		'fuel',
		'getStamp',
		'phaseName',
		'prompt',
		'transcript'
	];
	for (const key of requiredHudKeys) {
		if (!hudMap[key]) {
			throw new Error(`Missing HUD element for ${key}`);
		}
	}

	const hudMapTyped = /** @type {import('../types/uiTypes.js').HudMap} */ (hudMap);

	const sectionsTyped = /** @type {import('../types//uiTypes.js').UISections} */ (
		sections
	);

	const lightsTyped = /** @type {Lights} */ (indicatorLights);

	/** @type {import('../types/uiTypes.js').ModalElements} */
	const modals = {
		instruction: cast(document.getElementById('instruction_Modal')),
		next: cast(document.getElementById('next_Modal')),
		nextPhase: cast(
			/** @type {HTMLButtonElement} */ document.getElementById('nextPhase')
		),
		verifyButton: cast(
			/** @type {HTMLButtonElement} */ document.getElementById('verifyButton')
		)
	};

	const description = document.getElementById('hud-description');

	return {
		hudMap: hudMapTyped,
		description,
		controls,
		modals,
		dsky: {
			indicatorLights: lightsTyped,
			segmentDisplays,
			pushButtons,
			progLight
		},
		sections: sectionsTyped
	};
}

export { queryDom };
