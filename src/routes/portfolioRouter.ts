import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as upload from '../middlewares/imageHandler';
import * as portfolioController from '../controllers/portfolioController';

const portfolioRouter = Router();

/* 포트폴리오 등록 */
portfolioRouter.post(
  '/',
  AuthenticateHandler,
  upload.portfolioImageHandler,
  portfolioController.addPortfolioHandler
);

/* 전체 포트폴리오 목록 조회 */
portfolioRouter.get('/', AuthenticateHandler, portfolioController.getAllPortfoliosHandler);

/* 포트폴리오 상세 정보 조회 */
portfolioRouter.get(
  '/info/:portfolio_id',
  AuthenticateHandler,
  portfolioController.getPortfolioByIdHandler
);

export default portfolioRouter;
