import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import {
  addProjectHandler,
  getProjectsByRoleHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
  getMyProjectsByIdHandler,
  getMyBookmarkedProjectsByIdHandler,
} from '../controllers/projectController';
import { getProjectCommentsByIdHandler } from '../controllers/commentController';

const projectRouter = Router();

/* 모집 글 등록 */
projectRouter.post('/recruitment', AuthenticateHandler, addProjectHandler);

/* 전체 모집 글 목록 조회 */
projectRouter.get('/', AuthenticateHandler, getAllProjectsHandler);

/* 역할 별 모집 글 목록 조회 */
projectRouter.get('/role/:project_role', AuthenticateHandler, getProjectsByRoleHandler);

/* 모집 글 상세 정보 조회 */
projectRouter.get('/info/:project_id', AuthenticateHandler, getProjectByIdHandler);

/* 모집 글 별 댓글 목록 조회 */
projectRouter.get('/:project_id/comments', AuthenticateHandler, getProjectCommentsByIdHandler);

/* 마이페이지 회원 별 작성 모집 글 목록 조회 */
projectRouter.get('/user', AuthenticateHandler, getMyProjectsByIdHandler);

/* 마이페이지 회원 별 북마크 모집 글 목록 조회 */
projectRouter.get('/user/bookmark', AuthenticateHandler, getMyBookmarkedProjectsByIdHandler);

export default projectRouter;
