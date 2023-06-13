import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as bookmarkValidator from '../middlewares/validationHandler/bookmarkValidator';
import * as bookmarkProjectController from '../controllers/bookmarkProjectController';
import * as bookmarkPortfolioController from '../controllers/bookmarkPortfolioController';

const bookmarkRouter = Router();

/* 모집 글 북마크 등록 */
bookmarkRouter.post(
  '/project',
  AuthenticateHandler,
  bookmarkValidator.addProjectBookmarkValidateHandler,
  bookmarkProjectController.addBookmarkHandler
);

/* 포트폴리오 북마크 등록 */
bookmarkRouter.post(
  '/portfolio',
  AuthenticateHandler,
  bookmarkValidator.addPortfolioBookmarkValidateHandler,
  bookmarkPortfolioController.addBookmarkHandler
);

/* 모집 글 북마크 삭제 */
bookmarkRouter.delete(
  '/project/:project_id',
  AuthenticateHandler,
  bookmarkValidator.removeProjectBookmarkValidateHandler,
  bookmarkProjectController.removeBookmarkHandler
);

/* 포트폴리오 북마크 삭제 */
bookmarkRouter.delete(
  '/portfolio/:portfolio_id',
  AuthenticateHandler,
  bookmarkValidator.removePortfolioBookmarkValidateHandler,
  bookmarkPortfolioController.removeBookmarkHandler
);

export default bookmarkRouter;
