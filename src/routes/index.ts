import { Router } from 'express';
import rootRouter from './rootRouter';
import userRouter from './userRouter';
import projectRouter from './projectRouter';

const router = Router();

router.use('/v1', rootRouter);
router.use('/v1/users', userRouter);
router.use('/v1/projects', projectRouter);

export default router;
