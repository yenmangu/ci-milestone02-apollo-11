import { Router } from 'express';
import { getAudio } from '../controllers/audio.js';
const router = Router();

router.route('/').get(getAudio);

export { router as audioRouter };
