import { makeModule } from '../stateFactory.js';
import { ApproachPhaseController } from './approachPhaseController.js';
import { ApproachPhaseView } from './approachPhaseView.js';
import { ApproachPhaseState } from './approachPhaseState.js';

export const createApproachPhaseModule = makeModule(
	ApproachPhaseState,
	ApproachPhaseController,
	ApproachPhaseView,
	'APPROACH_PHASE'
);
