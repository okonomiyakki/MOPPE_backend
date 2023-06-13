import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as upload from '../middlewares/imageHandler';
import * as portfolioValidator from '../middlewares/validationHandler/portfolioValidator';
import * as portfolioController from '../controllers/portfolioController';
import * as commentPortfolioController from '../controllers/commentPortfolioController';

const portfolioRouter = Router();

/* 포트폴리오 등록 */
portfolioRouter.post(
  '/posts',
  AuthenticateHandler,
  upload.portfolioImageHandler,
  portfolioValidator.addPortfolioValidateHandler,
  portfolioController.addPortfolioHandler
);

/* 포트폴리오 상세 정보 수정 */
portfolioRouter.patch(
  '/posts/:portfolio_id',
  AuthenticateHandler,
  upload.portfolioImageHandler,
  portfolioValidator.editPortfolioValidateHandler,
  portfolioController.editPortfolioInfoHandler
);

/* 모집 글 삭제 */
portfolioRouter.delete(
  '/posts/:portfolio_id',
  AuthenticateHandler,
  portfolioController.removePortfolioHandler
);

/* 전체 포트폴리오 목록 조회 */
portfolioRouter.get('/', AuthenticateHandler, portfolioController.getAllPortfoliosHandler);

/* 포트폴리오 상세 정보 조회 */
portfolioRouter.get(
  '/info/:portfolio_id',
  AuthenticateHandler,
  portfolioController.getPortfolioByIdHandler
);

/* 포트폴리오 별 댓글 목록 조회 */
portfolioRouter.get(
  '/:portfolio_id/comments',
  AuthenticateHandler,
  commentPortfolioController.getProjectCommentsByIdHandler
);

/* 마이페이지 북마크 포트폴리오 목록 조회 */
portfolioRouter.get(
  '/user/bookmark',
  AuthenticateHandler,
  portfolioController.getMyBookmarkedPortfoliosByIdHandler
);

/* 다른 회원 마이페이지 작성 포트폴리오 목록 조회 */
portfolioRouter.get(
  '/user/:user_id',
  AuthenticateHandler,
  portfolioController.getUserPortfoliosByIdHandler
);

/* 마이페이지 작성 포트폴리오 목록 조회 */
portfolioRouter.get('/user', AuthenticateHandler, portfolioController.getMyPortfoliosByIdHandler);

export default portfolioRouter;
