/**
 * @typedef {import("../types/runtimeTypes.js").RuntimePhase} RuntimePhase
 * @typedef {import("../types/runtimeTypes.js").PhaseRange} PhaseRange
 */

import { secondsFromGet } from './GET.js';

/**
 * Build a sorted list of phase range times
 * @param {RuntimePhase[]} phases
 * @returns {PhaseRange[]}
 */

export function buildPhaseRanges(phases) {
	/** @type {PhaseRange[]} */ const ranges = [];

	for (let i = 0; i < phases.length; i++) {
		const phase = phases[i];
		const next = phases[i + 1];
		const startSeconds = secondsFromGet(phase.startGET);
		const endSeconds = next ? secondsFromGet(next.startGET) : Infinity;

		ranges.push({
			phaseId: phase.phaseId,
			startSeconds,
			endSeconds
		});
	}
	return ranges;
}
