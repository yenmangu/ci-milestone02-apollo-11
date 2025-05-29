import EventEmitter from './eventEmitter.js';

const pushButtonEmitter = new EventEmitter();
const indicatorLightsEmitter = new EventEmitter();
const stateEmitter = new EventEmitter();
const actionEmitter = new EventEmitter();

// Dev emitter
const devLightsEmitter = new EventEmitter();
const devNavEmitter = new EventEmitter();

export {
	pushButtonEmitter,
	indicatorLightsEmitter,
	stateEmitter,
	actionEmitter,
	devLightsEmitter,
	devNavEmitter
};
