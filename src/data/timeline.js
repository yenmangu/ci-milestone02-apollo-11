import { AppStates, AppStateKeys } from '../types/missionTypes.js';
let cachedTimeline = null;

/**
 * @typedef {import('../types/missionTypes.js').AppStateKey} AppStateKey
 * @typedef {import('../types/missionTypes.js').AppStateValue} AppStateValue
 * @typedef {import('../types/missionTypes.js').MissionStateKey} MissionStateKey
 * @typedef {import('../types/missionTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('../types/missionTypes.js').MissionPhase} MissionPhase
 * @typedef {import('../types/missionTypes.js').MissionStateValue} TimelineState
 */

/**
 * @type {{[K in AppStateKey]: AppStateValue}}
 */
const keyToValue = /** @type {any} */ (
	Object.fromEntries(
		Object.entries(AppStateKeys).map(([value, key]) => [key, value])
	)
);

// Valid timeline states (runtime check)
const VALID_TIMELINE_STATES = new Set(
	Object.values(AppStates).filter(
		v => v !== 'failed' && v !== 'paused' && v !== 'pre_start'
	)
);

/**
 * Loads and validates the timeline data
 * @returns {Promise<MissionTimeline>}
 */
export async function loadTimeline() {
	// Exit early if cachedTimeline exists
	console.log('loadTimeline invoked');
	if (cachedTimeline) {
		return cachedTimeline;
	}

	try {
		// Dynamic import
		const { default: timelineJsonRaw } = await import('./timeline.json', {
			with: { type: 'json' }
		});

		// Validate ALL phases match our types
		console.log('VTS', VALID_TIMELINE_STATES);

		const allValid = timelineJsonRaw.mission_phases.every(phase => {
			VALID_TIMELINE_STATES.has(phase.state);
		});

		const invalidStates = timelineJsonRaw.mission_phases
			.map(phase => phase.state)
			.filter(state => !VALID_TIMELINE_STATES.has(state));

		if (invalidStates.length > 0) {
			console.error('Invalid states in timeline:', invalidStates);
			throw new Error(`Invalid timeline data: ${invalidStates.join(', ')}`);
		}

		// if (!allValid) throw new Error('Invalid timeline data');

		/**
		 * @param {MissionStateKey} state
		 * @returns {MissionPhase | undefined}
		 */
		// const stateString =
		const getPhase = state => {
			const stateValue = keyToValue[state];
			const phase = timelineJsonRaw.mission_phases.find(
				p => p.state === stateValue
			);
			console.log('Phase found: ', phase);
			return phase;
		};

		/**
		 * @type {MissionTimeline}
		 */
		const timeline = Object.freeze({
			...timelineJsonRaw,
			getPhase
		});
		return timeline;
	} catch (error) {
		console.error('Failed to load timeline: ', error);
		throw error;
	}
}
