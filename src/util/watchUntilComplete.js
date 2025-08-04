/**
 * @typedef {import('../types/runtimeTypes.js').RuntimeCue} RuntimeCue
 * @typedef {import('../types/runtimeTypes.js').NonTimeAction} RuntimeAction
 * @typedef {import('../types/runtimeTypes.js').ActionEvent} ActionEvent
 * @typedef {import('../types/clockTypes.js').TickPayload} TickPayload
 * @typedef {import('../types/keypadTypes.js').KeypadState} KeypadState
 */

import {
	actionEmitter,
	agcEmitter,
	phaseEmitter,
	tickEmitter,
	pushButtonEmitter
} from '../event/eventBus.js';

/**
 * Subscribes to all 'action' and 'cue' events untill 'actionsComplete' is received.
 * Automatically unsubscribes both listeners upon completion.
 * Returns optional unsubscribe handle for early termination.
 *
 * @param {(event: ActionEvent) => void} onAction
 * @param {(event: RuntimeCue) => void} onCue
 * @param {(event: string) => void} onComplete
 * @param {(tick: TickPayload) => void} onTick
 * @param {(key: string,state: KeypadState) => void} onPushButtons
 * @returns {{unsubscribe: () => void}}
 */
export function watchUntilComplete(
	onAction,
	onCue,
	onComplete,
	onTick,
	onPushButtons
) {
	const actionSub = actionEmitter.on('action', onAction);
	const cueSub = actionEmitter.on('cue', onCue);
	const tickSub = tickEmitter.on('tick', onTick);
	const keyRelSub = pushButtonEmitter.on('key-rel', data => {
		onPushButtons('key-rel', data);
	});
	const pushButtonsFinaliseSub = pushButtonEmitter.on('finalise', data => {
		onPushButtons('finalise', data);
	});

	const opErrorSub = pushButtonEmitter.on('op-err', data => {
		onPushButtons('op-err', data);
	});
	const completeSub = actionEmitter.on(
		'actionsComplete',
		(/** @type {string} */ event) => {
			completeSub.unsubscribe();
			actionSub.unsubscribe();
			keyRelSub.unsubscribe();
			pushButtonsFinaliseSub.unsubscribe();
			opErrorSub.unsubscribe();
			onComplete(event);
		}
	);
	return {
		unsubscribe: () => {
			actionSub.unsubscribe();
			cueSub.unsubscribe();
			tickSub.unsubscribe();
			keyRelSub.unsubscribe();
			pushButtonsFinaliseSub.unsubscribe();
			opErrorSub.unsubscribe();
			completeSub.unsubscribe();
		}
	};
}

/**
 *
 * @param {(data: any) => void} onTelemetryAction
 * @returns
 */
export function watchTelemetryAction(onTelemetryAction) {
	const telemetrySub = phaseEmitter.on('telemetry', data => {
		onTelemetryAction(data);
	});
	return {
		unsubscribe: () => {
			telemetrySub.unsubscribe();
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
