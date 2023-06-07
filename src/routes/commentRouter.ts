import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as commentController from '../controllers/commentController';

const commentRouter = Router();

/* 댓글 등록 */
commentRouter.post('/', AuthenticateHandler, commentController.addCommentHandler);

/* 댓글 수정 */
commentRouter.put('/:comment_id', AuthenticateHandler, commentController.editCommentHandler);

/* 댓글 삭제 */
commentRouter.delete('/:comment_id', AuthenticateHandler, commentController.removeCommentHandler);

/* 마이페이지 작성 모집 글 목록 조회 */
commentRouter.get('/user', AuthenticateHandler, commentController.getMyCommentsByIdHandler);

export default commentRouter;
