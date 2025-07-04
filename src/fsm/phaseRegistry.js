/**
 * @typedef {import('../types/fsmTypes.js').PhaseRegistry} PhaseRegistry
 */

import { CSMSeparation } from '../states/phases/CSMSeparation.js';
import { P_63 } from '../states/phases/p_63.js';
import { P_64 } from '../states/phases/p_64.js';
import { P_66 } from '../states/phases/p_66.js';
import { PoweredDescent } from '../states/phases/poweredDescent.js';
import { PhaseIds } from '../types/timelineTypes.js';

/**
 * @type {PhaseRegistry}
 */
export const phaseRegistry = {
	[PhaseIds.CSM_SEPARATION]: CSMSeparation,
	[PhaseIds.PDI]: PoweredDescent,
	[PhaseIds.P_63]: P_63,
	[PhaseIds.P_64]: P_64,
	[PhaseIds.P_66]: P_66
};
