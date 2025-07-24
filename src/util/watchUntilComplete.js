/**
 * @typedef {import('../types/runtimeTypes.js').RuntimeCue} RuntimeCue
 * @typedef {import('../types/runtimeTypes.js').NonTimeAction} RuntimeAction
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 */

import {
	actionEmitter,
	agcEmitter,
	phaseEmitter,
	tickEmitter
} from '../event/eventBus.js';

/**
 * Subscribes to all 'action' and 'cue' events untill 'actionsComplete' is received.
 * Automatically unsubscribes both listeners upon completion.
 * Returns optional unsubscribe handle for early termination.
 *
 * @param {(event: { [key: string]: RuntimeAction}) => void} onAction
 * @param {(event: { [key: string]: RuntimeCue}) => void} onCue
 * @param {(event: string) => void} onComplete
 * @param {(tick:TickPayload) => void} onTick
 * @returns {{unsubscribe: () => void}}
 */
export function watchUntilComplete(onAction, onCue, onComplete, onTick) {
	const actionSub = actionEmitter.on('action', onAction);
	const cueSub = actionEmitter.on('cue', onCue);
	const tickSub = tickEmitter.on('tick', onTick);
	const completeSub = actionEmitter.on(
		'actionsComplete',
		(/** @type {string} */ event) => {
			completeSub.unsubscribe();
			actionSub.unsubscribe();
			onComplete(event);
		}
	);
	return {
		unsubscribe: () => {
			actionSub.unsubscribe();
			cueSub.unsubscribe();
			tickSub.unsubscribe();
			completeSub.unsubscribe();
		}
	};
}

export function watchPhaseAction(onAction) {
	const phaseSub = phaseEmitter.on('action', onAction);

	return {
		unsubscribe: () => {
			phaseSub.unsubscribe();
		}
	};
}

export function watchAgcAction(onAction) {
	const actionSub = agcEmitter.on('action', onAction);
	return {
		unsubscribe: () => {
			actionSub.unsubscribe();
		}
	};
}
