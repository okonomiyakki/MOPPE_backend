import { Router } from 'express';
import rootRouter from './rootRouter';
import userRouter from './userRouter';

const router = Router();

router.use('/', rootRouter);
router.use('/users', userRouter);

export default router;
