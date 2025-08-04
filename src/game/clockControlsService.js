/** @type {import('./clockControls.js').ClockControls | null} */
let clockControls = null;

/**
 *
 * @param {import('./clockControls.js').ClockControls} instance
 */
export function registerClockControls(instance) {
	clockControls = instance;
}

export function getClockControls() {
	if (!clockControls) throw new Error('ClockControls not registered');
	return clockControls;
}
