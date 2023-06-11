import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as upload from '../middlewares/imageHandler';
import * as projectValidator from '../middlewares/validationHandler/projectValidator';
import * as projectController from '../controllers/projectController';
import * as commentProjectController from '../controllers/commentProjectController';

const projectRouter = Router();

/* 모집 글 등록 */
projectRouter.post(
  '/recruitment',
  AuthenticateHandler,
  upload.projectImageHandler,
  projectValidator.addProjectValidateHandler,
  projectController.addProjectHandler
);

/* 모집 글 상세 정보 수정 */
projectRouter.patch(
  '/recruitment/:project_id',
  AuthenticateHandler,
  upload.projectImageHandler,
  projectController.editProjectInfoHandler
);

/* 모집 글 모집 상태 수정 */
projectRouter.patch(
  '/recruitment/status/:project_id',
  AuthenticateHandler,
  projectController.editProjectStatusHandler
);

/* 모집 글 삭제 */
projectRouter.delete(
  '/recruitment/:project_id',
  AuthenticateHandler,
  projectController.removeProjectHandler
);

/* 전체 모집 글 목록 조회 */
projectRouter.get('/', AuthenticateHandler, projectController.getAllProjectsHandler);

/* 역할 별 모집 글 목록 조회 */
projectRouter.get(
  '/role/:project_role',
  AuthenticateHandler,
  projectController.getProjectsByRoleHandler
);

/* 모집 글 상세 정보 조회 */
projectRouter.get(
  '/info/:project_id',
  AuthenticateHandler,
  projectController.getProjectByIdHandler
);

/* 모집 글 별 댓글 목록 조회 */
projectRouter.get(
  '/:project_id/comments',
  AuthenticateHandler,
  commentProjectController.getProjectCommentsByIdHandler
);

/* 마이페이지 북마크 모집 글 목록 조회 */
projectRouter.get(
  '/user/bookmark',
  AuthenticateHandler,
  projectController.getMyBookmarkedProjectsByIdHandler
);

/* 다른 회원 마이페이지 작성 모집 글 목록 조회 */
projectRouter.get(
  '/user/:user_id',
  AuthenticateHandler,
  projectController.getUserProjectsByIdHandler
);

/* 마이페이지 작성 모집 글 목록 조회 */
projectRouter.get('/user', AuthenticateHandler, projectController.getMyProjectsByIdHandler);

export default projectRouter;
