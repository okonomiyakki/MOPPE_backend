import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import { getMyCommentsByIdHandler } from '../controllers/commentController';

const commentRouter = Router();

/* 마이페이지 회원 별 작성 모집 글 목록 조회 */
commentRouter.get('/user', AuthenticateHandler, getMyCommentsByIdHandler);

export default commentRouter;
