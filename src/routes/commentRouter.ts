import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as commentProjectController from '../controllers/commentProjectController';
import * as commentPortfolioController from '../controllers/commentPortfolioController';

const commentRouter = Router();

/* 모집 글 댓글 등록 */
commentRouter.post('/project', AuthenticateHandler, commentProjectController.addCommentHandler);

/* 포트폴리오 댓글 등록 */
commentRouter.post('/portfolio', AuthenticateHandler, commentPortfolioController.addCommentHandler);

/* 모집 글 댓글 수정 */
commentRouter.put(
  '/project/:comment_id',
  AuthenticateHandler,
  commentProjectController.editCommentHandler
);

/* 포트폴리오 댓글 수정 */
commentRouter.put(
  '/portfolio/:comment_id',
  AuthenticateHandler,
  commentPortfolioController.editCommentHandler
);

/* 모집 글 댓글 삭제 */
commentRouter.delete(
  '/project/:comment_id',
  AuthenticateHandler,
  commentProjectController.removeCommentHandler
);

/* 포트폴리오 댓글 삭제 */
commentRouter.delete(
  '/portfolio/:comment_id',
  AuthenticateHandler,
  commentPortfolioController.removeCommentHandler
);

/* 마이페이지 작성 모집 글 목록 조회 */
commentRouter.get('/user', AuthenticateHandler, commentProjectController.getMyCommentsByIdHandler);

export default commentRouter;
