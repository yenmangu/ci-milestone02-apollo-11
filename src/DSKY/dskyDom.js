import { initSevenSegmentDisplay } from './seven-segment/initSevenSegment.js';
import { cast } from '../util/cast.js';

/**
 * @returns {import('../types/uiTypes.js').DskyDomElements}
 */

function queryDom() {
	const sevenSegmentDisplays = cast(
		document.querySelectorAll('.seven-segment span[id]'),
		'nodeList'
	);
	/** @type {{[key: string]: HTMLElement}} */
	const indicatorLights = Array.from(
		document.querySelectorAll('.indicator-lights .light')
	).reduce((map, element) => {
		map[element.id] = cast(element);
		return map;
	}, {});
	const progLight = document.getElementById('compActy');
	const displayMap = initSevenSegmentDisplay();
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

	return {
		sevenSegmentDisplays,
		displayMap,
		indicatorLights,
		progLight,
		pushButtons,
		hudMap: hudMapTyped
	};
}

export { queryDom };
