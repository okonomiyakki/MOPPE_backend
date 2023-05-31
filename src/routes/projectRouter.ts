import { Router } from 'express';
import { addProjectHandler, getProjectsByRoleHandler } from '../controllers/projectController';
import AuthenticateHandler from '../middlewares/jwt';

const projectRouter = Router();

/* 모집글 등록 */
projectRouter.post('/recruitment', AuthenticateHandler, addProjectHandler);

/* 모집 역할별 모집글 목록 조회 */
projectRouter.get('/role/:project_role', getProjectsByRoleHandler);

export default projectRouter;
