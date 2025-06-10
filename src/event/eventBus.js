import EventEmitter from './eventEmitter.js';

const tickEmitter = new EventEmitter();
const pushButtonEmitter = new EventEmitter();
const indicatorLightsEmitter = new EventEmitter();
const stateEmitter = new EventEmitter();
const actionEmitter = new EventEmitter();
const phaseNameEmitter = new EventEmitter();
const agcEmitter = new EventEmitter();
const phaseEmitter = new EventEmitter();
const runningEmitter = new EventEmitter();
const telemetryEmitter = new EventEmitter();

// Dev emitter
const devLightsEmitter = new EventEmitter();
const devNavEmitter = new EventEmitter();

export {
	tickEmitter,
	pushButtonEmitter,
	indicatorLightsEmitter,
	stateEmitter,
	actionEmitter,
	phaseNameEmitter,
	agcEmitter,
	phaseEmitter,
	runningEmitter,
	telemetryEmitter,
	// Dev emitters
	devLightsEmitter,
	devNavEmitter
};
