import { makeModule } from '../stateFactory.js';
import { FailedController } from './failedController.js';
import { FailedState } from './failedState.js';
import { FailedView } from './failedView.js';

export const createFailedModule = makeModule(
	FailedState,
	FailedController,
	FailedView,
	'FAILED'
);
