import { Router } from 'express';
import {
  addProjectHandler,
  getProjectsByRoleHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
  getMyProjectsByIdHandler,
} from '../controllers/projectController';
import AuthenticateHandler from '../middlewares/authHandler';

const projectRouter = Router();

/* 모집 글 등록 */
projectRouter.post('/recruitment', AuthenticateHandler, addProjectHandler);

/* 전체 모집 글 목록 조회 */
projectRouter.get('/', AuthenticateHandler, getAllProjectsHandler);

/* 역할 별 모집 글 목록 조회 */
projectRouter.get('/role/:project_role', AuthenticateHandler, getProjectsByRoleHandler);

/* 모집 글 상세 정보 조회 */
projectRouter.get('/info/:project_id', AuthenticateHandler, getProjectByIdHandler);

/* 마이페이지 회원 별 작성 모집 글 목록 조회 */
projectRouter.get('/user', AuthenticateHandler, getMyProjectsByIdHandler);

export default projectRouter;
