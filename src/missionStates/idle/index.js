import { makeModule } from '../stateFactory.js';
import { IdleController } from './idleController.js';
import { IdleState } from './idleState.js';
import { IdleView } from './idleView.js';

export const createIdleModule = makeModule(
	IdleState,
	IdleController,
	IdleView,
	'IDLE'
);
