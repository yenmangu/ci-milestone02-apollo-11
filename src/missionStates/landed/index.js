import { makeModule } from '../stateFactory.js';
import { LandedController } from './landedController.js';
import { LandedState } from './landedState.js';
import { LandedView } from './landedView.js';

export const createLandedModule = makeModule(
	LandedState,
	LandedController,
	LandedView,
	'LANDED'
);
