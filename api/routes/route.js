import { Router } from 'express';

import { audioRouter } from './audioRoute.js';
import { imageRouter } from './imageRoute.js';
import { videoRouter } from './videoRoute.js';

const router = Router();

router.use('/audio', audioRouter);
router.use('/image', imageRouter);
router.use('/video', videoRouter);

export { router as apiRouter };
