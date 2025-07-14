import { cast } from '../util/cast.js';

/**
 * @typedef {import('../types/uiTypes.js').UIStructure} UIStructure
 */

function initSevenSegmentDisplay() {
	/** @type {Record<string, HTMLElement>} */
	const map = {};

	document.querySelectorAll('.seven-segment span[id]').forEach(el => {
		// console.log('found segment: ', el);
		const castEl = cast(el);
		map[castEl.id] = castEl;
	});
	// console.debug('Map of seven segment: ', map);
	return map;
}

/**
 * @returns {import('../types/uiTypes.js').PushButtonsMap}
 */
function initPushButtons() {
	/** @type {Object.<string, HTMLButtonElement>} */
	const map = Array.from(document.querySelectorAll('.push-button')).reduce(
		(map, el) => {
			const castEl = cast(/** @type {HTMLButtonElement} */ el);
			map[castEl.id] = castEl;
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
	// const segmentDisplays = cast(
	// 	document.querySelectorAll('.seven-segment span[id]'),
	// 	'nodeList'
	// );

	/** @type {{[key: string]: HTMLElement}} */
	const indicatorLights = Array.from(
		document.querySelectorAll('.indicator-lights .light')
	).reduce((map, element) => {
		map[element.id] = cast(element);
		return map;
	}, {});
	const progLight = cast(document.getElementById('compActy'));
	if (!progLight) {
		throw new Error('Error missing progLight in UI elements');
	}
	const segmentDisplays = initSevenSegmentDisplay();
	if (!segmentDisplays) {
		throw new Error('Missing segmentDisplays in UI elements');
	}
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
			const key = element.id.slice(element.id.indexOf('-') + 1);
			map[key] = cast(element);
			return map;
		},
		{}
	);

	const requiredHudKeys = [
		'lunar_altitude',
		'velocity_fps',
		'fuel_percent',
		'get_stamp',
		'phase_name',
		'altitude_units',
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

	return {
		hudMap: hudMapTyped,
		modals,
		dsky: {
			indicatorLights,
			segmentDisplays,
			pushButtons,
			progLight
		},
		sections: sectionsTyped
	};
}

export { queryDom };
