import { PreStartState } from './preStartState.js';
import { PreStartView } from './preStartView.js';
import { PreStartController } from './preStartController.js';

import { makeModule } from '../stateFactory.js';

export const createPreStartModule = makeModule(
	PreStartState,
	PreStartController,
	PreStartView,
	'PRE_START'
);
