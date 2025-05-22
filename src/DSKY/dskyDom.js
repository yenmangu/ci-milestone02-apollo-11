import { initSevenSegmentDisplay } from '../seven-segment/initSevenSegment.js';
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
	const indicatorLights = cast(
		document.querySelectorAll('.indicator-lights .light'),
		'nodeList'
	);
	const progLight = document.getElementById('compActy');
	const displayMap = initSevenSegmentDisplay();
	const pushButtons = cast(
		Array.from(document.querySelectorAll('.push-button')),
		'nodeList'
	);

	return {
		sevenSegmentDisplays,
		displayMap,
		indicatorLights,
		progLight,
		pushButtons
	};
}

export { uiElements };
