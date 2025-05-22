import { PreStartState } from './preStartState.js';
import { PreStartRender } from './preStartRender.js';
import { preStartController } from './preStartController.js';

export default {
	state: PreStartState,
	controller: preStartController,
	render: PreStartRender
};
