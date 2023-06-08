import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as bookmarkController from '../controllers/bookmarkController';

const bookmarkRouter = Router();

/* 북마크 등록 */
bookmarkRouter.post('/', AuthenticateHandler, bookmarkController.addBookmarkHandler);

/* 북마크 삭제 */
bookmarkRouter.delete(
  '/:project_id',
  AuthenticateHandler,
  bookmarkController.removeBookmarkHandler
);

export default bookmarkRouter;
