import { States } from 'src/state/states.js';
import { AppStates } from '../types/missionTypes.js';
let cachedTimeline = null;

/**
 * @typedef {import('../types/missionTypes.js').MissionStateKey} MissionStateKey
 * @typedef {import('../types/missionTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('../types/missionTypes.js').MissionPhase} MissionPhase
 * @typedef {import('../types/missionTypes.js').TimelineState} TimelineState
 */

// Valid timeline states (runtime check)
const VALID_TIMELINE_STATES = new Set(
	Object.values(AppStates).filter(v => v !== 'failed' && v !== 'paused')
);

/**
 *
 * @param {string} state
 * @returns {state is TimelineState}
 */
function isTimelineState(state) {
	return VALID_TIMELINE_STATES.has(state);
}

/**
 * Loads and validates the timeline data
 * @returns {Promise<MissionTimeline>}
 */
export async function loadTimeline() {
	// Exit early if cachedTimeline exists
	if (cachedTimeline) {
		return cachedTimeline;
	}

	try {
		// Dynamic import
		const { default: timelineJson } = await import('./timeline.json', {
			with: { type: 'json' }
		});

		// Validate ALL phases match our types
		const allValid = timelineJson.mission_phases.every(phase => {
			return VALID_TIMELINE_STATES.has(phase.state);
		});

		if (!allValid) throw new Error('Invalid timeline data');

		/**
		 * @param {MissionStateKey} state
		 * @returns {MissionPhase | undefined}
		 */

		// const stateString =
		const getPhase = state => {
			return timelineJson.mission_phases.find(p => p.state === state);
		};
	} catch (error) {
		console.error('Failed to load timeline: ', error);
		throw error;
	}
}
