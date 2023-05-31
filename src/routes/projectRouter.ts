import { Router } from 'express';
import { addProjectHandler } from '../controllers/projectController';
import AuthenticateHandler from '../middlewares/jwt';

const projectRouter = Router();

/* 모집글 등록 */
projectRouter.post('/recruitment', AuthenticateHandler, addProjectHandler);

export default projectRouter;
