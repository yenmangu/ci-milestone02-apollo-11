import EventEmitter from './eventEmitter.js';

const pushButtonEmitter = new EventEmitter();
const indicatorLightsEmitter = new EventEmitter();
const stateEmitter = new EventEmitter();

// Dev lights emitter
const devLightsEmitter = new EventEmitter();

export {
	pushButtonEmitter,
	indicatorLightsEmitter,
	stateEmitter,
	devLightsEmitter
};
