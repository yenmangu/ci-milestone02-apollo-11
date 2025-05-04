import { Router } from 'express';
import { getImages } from '../controllers/images.js';

const router = Router();

router.use('/images', getImages);

export { router as imageRouter };
