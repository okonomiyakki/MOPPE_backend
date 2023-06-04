import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import {
  addCommentHandler,
  editCommentHandler,
  removeCommentHandler,
  getProjectCommentsByIdHandler,
  getMyCommentsByIdHandler,
} from '../controllers/commentController';

const commentRouter = Router();

/* 댓글 등록 */
commentRouter.post('/', AuthenticateHandler, addCommentHandler);

/* 댓글 수정 */
commentRouter.put('/:comment_id', AuthenticateHandler, editCommentHandler);

/* 댓글 삭제 */
commentRouter.delete('/:comment_id', AuthenticateHandler, removeCommentHandler);

/* 마이페이지 회원 별 작성 모집 글 목록 조회 */
commentRouter.get('/user', AuthenticateHandler, getMyCommentsByIdHandler);

export default commentRouter;
