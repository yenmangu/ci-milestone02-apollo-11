import EventEmitter from './eventEmitter.js';

const pushButtonEmitter = new EventEmitter();
const indicatorLightsEmitter = new EventEmitter();

// Dev lights emitter
const devLightsEmitter = new EventEmitter();

export { pushButtonEmitter, indicatorLightsEmitter, devLightsEmitter };
