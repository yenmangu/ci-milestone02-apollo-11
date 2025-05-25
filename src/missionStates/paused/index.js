import { makeModule } from '../stateFactory.js';
import { PausedController } from './pausedController.js';
import { PauseState } from './pausedState.js';
import { PausedView } from './pausedView.js';

export const createPausedModule = makeModule(
	PauseState,
	PausedController,
	PausedView,
	'PAUSED'
);
