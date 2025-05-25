import { makeModule } from '../stateFactory.js';
import { FinalDescentController } from './finalDescentController.js';
import { FinalDescentState } from './finalDescentState.js';
import { FinalDescentView } from './finalDescentView.js';

export const createFinalDescentModule = makeModule(
	FinalDescentState,
	FinalDescentController,
	FinalDescentView,
	'FINAL_DESCENT'
);
