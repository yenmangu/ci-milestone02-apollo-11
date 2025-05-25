import { makeModule } from '../stateFactory.js';
import { DescentOrbitController } from './descentOrbitController.js';
import { DescentOrbitState } from './descentOrbitState.js';
import { DescentOrbitView } from './descentOrbitView.js';

export const createDescentOrbitModule = makeModule(
	DescentOrbitState,
	DescentOrbitController,
	DescentOrbitView,
	'DESCENT_ORBIT'
);
