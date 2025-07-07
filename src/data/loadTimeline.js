/**
 * @typedef {import('../types/timelineTypes.js').RawTimelineFile} RawTimelineFile
 * @typedef {import('../types/timelineTypes.js').RawInterruptFile} RawInterruptFile
 * @typedef {import('../types/timelineTypes.js').JSON_MissionPhase} RawMissionPhase
 * @typedef {import('../types/timelineTypes.js').JSON_TimelineMetadata} RawTimelineMetadata
 * @typedef {import('../types/timelineTypes.js').JSON_TimelineCue} RawTimelineCue
 * @typedef {import('../types/timelineTypes.js').JSON_NonTimeAction} RawNonTimeAction
 * @typedef {import('../types/timelineTypes.js').PhaseId} PhaseId
 */

import { secondsFromGet } from '../util/GET.js';

/**
 * @typedef {import('../types/runtimeTypes.js').MissionTimeline} MissionTimeline
 * @typedef {import('../types/runtimeTypes.js').RuntimePhase} RuntimePhase
 * @typedef {import('../types/runtimeTypes.js').RuntimeCue} RuntimeTimelineCue
 * @typedef {import('../types/runtimeTypes.js').TimelineMetadata} TimelineMetadata
 * @typedef {import('../types/runtimeTypes.js').NonTimeAction} NonTimeAction
 */

/**
 *
 * @param {RawTimelineCue} rawCue
 * @param {string} phaseId
 * @param {number} index
 * @returns {RuntimeTimelineCue}
 */
function normaliseCue(rawCue, phaseId, index) {
	const key = rawCue.key || `${phaseId}_${index.toString().padStart(2, '0')}`;
	const getSeconds = secondsFromGet(rawCue.get);
	const text = Array.isArray(rawCue.data.text)
		? rawCue.data.text
		: [rawCue.data.text];
	/** @type {RuntimeTimelineCue} */ const normalisedCue = {
		get: rawCue.get,
		getSeconds,
		transcript: rawCue.transcript ?? false,
		dsky: rawCue.dsky ?? false,
		hud: rawCue.hud ?? false,
		input: rawCue.input ?? false,
		output: rawCue.output ?? false,
		semantic: rawCue.semantic ?? false,
		context: rawCue.context ?? '',
		key,
		requiresAction: rawCue.requires_action ?? '',
		// Remove actionComepleted entry
		data: {
			...rawCue.data,
			text
		},
		failsAfter: rawCue.fails_after ?? null,
		triggers: rawCue.triggers ?? null
	};
	// Add only if action is required
	if (rawCue.requires_action) {
		normalisedCue.actionCompleted = false;
	}
	return normalisedCue;
}

/**
 *
 * @param {RawNonTimeAction} rawAction
 * @returns {NonTimeAction}
 */
function normaliseAction(rawAction) {
	if (!rawAction) {
		throw new Error('Invalid non-time action passed to normaliseAction');
	}
	return {
		description: rawAction.description,
		action: rawAction.action ?? null,
		verb: rawAction.verb ?? null,
		noun: rawAction.noun ?? null,
		program: rawAction.program ?? null,
		failsAfter: rawAction.fails_after ?? null
	};
}

/**
 *
 * @param {RawTimelineMetadata} rawMeta
 * @returns {TimelineMetadata}
 */
function parseMetadata(rawMeta) {
	return {
		timeScale: rawMeta.time_scale,
		historicalContext: rawMeta.historical_context
	};
}

/**
 * Maps all of the raw JSON cues to the runtime shape, ensuring each cue has a unique key, if not provided.
 * Ensures any text in cue data is indeed an array.
 * @param {RawMissionPhase} raw
 * @param {number} index
 * @returns {RuntimePhase}
 */
function buildMissionPhase(raw, index) {
	const rawCues = raw.timeline_cues || [];
	const allCues = rawCues.map((cue, cueIndex) =>
		normaliseCue(cue, raw.phase_id, cueIndex)
	);
	const actions = raw.non_time_specific_actions ?? [];

	/** @type {import('../types/runtimeTypes.js').NonTimeAction[]} */
	const nonTimeActions = (raw.non_time_specific_actions ?? [])
		.map(normaliseAction)
		.filter(Boolean);

	const cuesByKey = Object.fromEntries(allCues.map(cue => [cue.key, cue]));

	return {
		phaseId: raw.phase_id,
		phaseName: raw.phase_name,
		description: raw.description,
		startGET: raw.start_get,
		endGET: undefined,
		initialState: raw.initial_state,
		endState: raw.initial_state,
		allCues,
		cuesByKey,
		nonTimeActions,
		failStates: raw.fail_states || []
	};
}

let cachedTimeline = null;

/**
 *
 * @returns {Promise<MissionTimeline>}
 */
export async function loadTimeline() {
	if (cachedTimeline) {
		return cachedTimeline;
	}

	try {
		const { default: timelineJsonRaw } = await import('./timeline_phases.json', {
			with: { type: 'json' }
		});

		const runtimePhases = timelineJsonRaw.phases.map(buildMissionPhase);

		const metadata = parseMetadata(timelineJsonRaw.metadata);

		/**
		 *
		 * @param {PhaseId} state
		 * @returns {RuntimePhase}
		 */
		const getPhase = state => {
			const phase = runtimePhases.find(p => p.phaseId === state);
			return phase;
		};

		/**
		 * @type {MissionTimeline}
		 */
		cachedTimeline = Object.freeze({ runtimePhases, metadata, getPhase });

		return cachedTimeline;
	} catch (error) {
		console.error('Failed to load timeline: ', error);
		throw error;
	}
}
