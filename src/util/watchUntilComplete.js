/**
 * @typedef {import('../types/runtimeTypes.js').RuntimeCue} RuntimeCue
 * @typedef {import('../types/runtimeTypes.js').NonTimeAction} RuntimeAction
 */

import { actionEmitter, agcEmitter, phaseEmitter } from '../event/eventBus.js';

/**
 * Subscribes to all 'action' and 'cue' events untill 'actionsComplete' is received.
 * Automatically unsubscribes both listeners upon completion.
 * Returns optional unsubscribe handle for early termination.
 *
 * @param {(event: { [key: string]: RuntimeAction}) => void} onAction
 * @param {(event: { [key: string]: RuntimeCue}) => void} onCue
 * @param {(event: string) => void} onComplete
 * @returns {{unsubscribe: () => void}}
 */
export function watchUntilComplete(onAction, onCue, onComplete) {
	const actionSub = actionEmitter.on('action', onAction);
	const cueSub = actionEmitter.on('cue', onCue);
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
