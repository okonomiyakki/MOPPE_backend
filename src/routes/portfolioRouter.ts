import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as upload from '../middlewares/imageHandler';
import * as portfolioController from '../controllers/portfolioController';

const portfolioRouter = Router();

/* 포트폴리오 등록 */
portfolioRouter.post(
  '/posts',
  AuthenticateHandler,
  upload.portfolioImageHandler,
  portfolioController.addPortfolioHandler
);

export default portfolioRouter;
