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
	const progLight = document.getElementById('compActy');
	const segmentDisplays = initSevenSegmentDisplay();
	const pushButtons = cast(
		Array.from(document.querySelectorAll('.push-button')),
		'nodeList'
	);

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

	/** @type {import('../types/uiTypes.js').ModalElements} */
	const modals = {
		instruction: cast(document.getElementById('instructions_Modal')),
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
		}
	};
}

export { queryDom };
