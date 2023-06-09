import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as bookmarkProjectController from '../controllers/bookmarkProjectController';

const bookmarkRouter = Router();

/* 북마크 등록 */
bookmarkRouter.post('/', AuthenticateHandler, bookmarkProjectController.addBookmarkHandler);

/* 북마크 삭제 */
bookmarkRouter.delete(
  '/:project_id',
  AuthenticateHandler,
  bookmarkProjectController.removeBookmarkHandler
);

export default bookmarkRouter;
