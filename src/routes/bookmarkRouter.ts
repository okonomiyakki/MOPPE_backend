import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import { addBookmarkHandler } from '../controllers/bookmarkController';

const bookmarkRouter = Router();

/* 북마크 등록 */
bookmarkRouter.post('/', AuthenticateHandler, addBookmarkHandler);

export default bookmarkRouter;
