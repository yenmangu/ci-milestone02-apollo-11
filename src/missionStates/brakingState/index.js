import { makeModule } from '../stateFactory.js';
import { BrakingPhaseController } from './brakingPhaseController.js';
import { BrakingPhaseView } from './brakingPhaseView.js';
import { BrakingPhaseState } from './brakingState.js';

export const createBrakingPhaseModule = makeModule(
	BrakingPhaseState,
	BrakingPhaseController,
	BrakingPhaseView,
	'BRAKING_PHASE'
);
