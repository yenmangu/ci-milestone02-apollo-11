import { PreStartState } from './preStartState.js';
import { PreStartView } from './preStartView.js';
import { preStartController } from './preStartController.js';
import { DSKYInterface } from '../../DSKY/dskyInterface.js';
import { GameController } from '../../game/gameController.js';
import { AppStates } from '../../types/missionTypes.js';

/**
 *
 * @param {DSKYInterface} dskyInterface
 * @param {GameController} gameController
 */
export default function createPreStartModule(dskyInterface, gameController) {
	const state = new PreStartState(gameController, dskyInterface, 'PRE_START');
	return { state };
}

// export default {
// 	state: PreStartState,
// 	controller: preStartController,
// 	render: PreStartRender
// };
