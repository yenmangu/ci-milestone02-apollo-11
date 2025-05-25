import { makeModule } from '../stateFactory.js';
import { Alarm1201State } from './1201AlarmState.js';
import { Alarm1201Controller } from './1201Controller.js';
import { Alarm1201View } from './1201View.js';

export const createAlarm1201Module = makeModule(
	Alarm1201State,
	Alarm1201Controller,
	Alarm1201View,
	'PROG_ALARM_1201'
);
