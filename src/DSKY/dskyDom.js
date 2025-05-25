import { initSevenSegmentDisplay } from './seven-segment/initSevenSegment.js';
import { cast } from '../util/cast.js';

/**
 * @type {import('../types/uiTypes.js').DskyDomElements}
 */
const uiElements = queryDom();

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

	/** @type {{[key: string]: HTMLElement}} */
	const instrumentsMap = Array.from(
		document.querySelectorAll('span[id^="instrument-"]')
	).reduce((map, element) => {
		const key = element.id.slice(element.id.indexOf('-'));
		map[key] = cast(element);
		return map;
	}, {});

	return {
		sevenSegmentDisplays,
		displayMap,
		indicatorLights,
		progLight,
		pushButtons,
		instrumentsMap
	};
}

export { uiElements };
