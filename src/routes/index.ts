import { Router } from 'express';
import rootRouter from './rootRouter';
import userRouter from './userRouter';
import projectRouter from './projectRouter';

const router = Router();

router.use('/', rootRouter);
router.use('/users', userRouter);
router.use('/projects', projectRouter);

export default router;
