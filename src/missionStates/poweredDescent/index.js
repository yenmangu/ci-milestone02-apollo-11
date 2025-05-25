import { makeModule } from '../stateFactory.js';
import { PoweredDescentController } from './poweredDescentController.js';
import { PoweredDescentState } from './poweredDescentState.js';
import { PoweredDescentView } from './poweredDescentView.js';

export const createPoweredDescentModule = makeModule(
	PoweredDescentState,
	PoweredDescentController,
	PoweredDescentView,
	'POWERED_DESCENT'
);
