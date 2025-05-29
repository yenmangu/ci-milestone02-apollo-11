import { actionEmitter } from '../event/eventBus.js';

/**
 * Subscribes to all 'action' events untill 'actionsComplete' is received.
 * Automatically unsubscribes both listeners upon completion,
 * Returns optional unsubscribe handle for early termination.
 *
 * @param {(event: {type: string, [key: string]: any}) => void} onAction
 * @param {(event: {type: string, [key: string]: any}) => void} onComplete
 * @returns {{unsubscribe: () => void}}
 */
export default function watchUntilComplete(onAction, onComplete) {
	const actionSub = actionEmitter.on('action', onAction);
	const completeSub = actionEmitter.on('actionsComplete', event => {
		completeSub.unsubscribe();
		actionSub.unsubscribe();
		onComplete(event);
	});
	return {
		unsubscribe: () => {
			actionSub.unsubscribe();
			completeSub.unsubscribe();
		}
	};
}
