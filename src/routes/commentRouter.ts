import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as commentProjectController from '../controllers/commentProjectController';
import * as commentPortfolioController from '../controllers/commentPortfolioController';

const commentRouter = Router();

/* 모집 글 댓글 등록 */
commentRouter.post('/project', AuthenticateHandler, commentProjectController.addCommentHandler);

/* 포트폴리오 댓글 등록 */
commentRouter.post('/portfolio', AuthenticateHandler, commentPortfolioController.addCommentHandler);

/* 댓글 수정 */
commentRouter.put('/:comment_id', AuthenticateHandler, commentProjectController.editCommentHandler);

/* 댓글 삭제 */
commentRouter.delete(
  '/:comment_id',
  AuthenticateHandler,
  commentProjectController.removeCommentHandler
);

/* 마이페이지 작성 모집 글 목록 조회 */
commentRouter.get('/user', AuthenticateHandler, commentProjectController.getMyCommentsByIdHandler);

export default commentRouter;
