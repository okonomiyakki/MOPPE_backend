import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as bookmarkProjectController from '../controllers/bookmarkProjectController';
import * as bookmarkPortfolioController from '../controllers/bookmarkPortfolioController';

const bookmarkRouter = Router();

/* 모집 글 북마크 등록 */
bookmarkRouter.post('/project', AuthenticateHandler, bookmarkProjectController.addBookmarkHandler);

/* 포트폴리오 북마크 등록 */
bookmarkRouter.post(
  '/portfolio',
  AuthenticateHandler,
  bookmarkPortfolioController.addBookmarkHandler
);

/* 북마크 삭제 */
bookmarkRouter.delete(
  '/:project_id',
  AuthenticateHandler,
  bookmarkProjectController.removeBookmarkHandler
);

export default bookmarkRouter;
