import { makeModule } from '../stateFactory.js';
import { Alarm1202Controller } from './1202AlarmController.js';
import { Alarm1202State } from './1202AlarmState.js';
import { Alarm1202View } from './1202AlarmView.js';

export const createAlarm1202Module = makeModule(
	Alarm1202State,
	Alarm1202Controller,
	Alarm1202View,
	'PROG_ALARM_1202'
);
