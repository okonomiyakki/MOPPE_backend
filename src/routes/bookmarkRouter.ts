import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import { addBookmarkHandler, removeBookmarkHandler } from '../controllers/bookmarkController';

const bookmarkRouter = Router();

/* 북마크 등록 */
bookmarkRouter.post('/', AuthenticateHandler, addBookmarkHandler);

/* 북마크 삭제 */
bookmarkRouter.delete('/:project_id', AuthenticateHandler, removeBookmarkHandler);

export default bookmarkRouter;
