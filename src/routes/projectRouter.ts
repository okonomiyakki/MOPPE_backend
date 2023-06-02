import { Router } from 'express';
import {
  addProjectHandler,
  getProjectsByRoleHandler,
  getAllProjectsHandler,
} from '../controllers/projectController';
import AuthenticateHandler from '../middlewares/jwt';

const projectRouter = Router();

/* 모집글 등록 */
projectRouter.post('/recruitment', AuthenticateHandler, addProjectHandler);

/* 전체 모집글 목록 조회 */
projectRouter.get('/', AuthenticateHandler, getAllProjectsHandler);

/* 역할별 모집글 목록 조회 */
projectRouter.get('/role/:project_role', AuthenticateHandler, getProjectsByRoleHandler);

export default projectRouter;
