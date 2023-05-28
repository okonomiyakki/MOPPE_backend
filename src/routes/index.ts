import { Router } from 'express';
import rootRouter from './rootRouter';

const router = Router();

router.use('/', rootRouter);

export default router;
