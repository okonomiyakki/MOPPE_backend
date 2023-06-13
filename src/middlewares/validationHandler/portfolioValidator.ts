import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validateDto } from '../../utils/dtoValidator';
import env from '../../config/envconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as Portfolio from '../../database/dtos/portfolioDto';

export const addPortfolioValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const {
      portfolio_title,
      portfolio_summary,
      portfolio_github,
      portfolio_stacks,
      portfolio_description,
      memberIds,
    } = req.body;
    const fileList = req.files as any[];

    if (user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    if (fileList.length > 0) {
      const imgFileRoots = fileList.map(
        (file) => `${env.PORTFOLIO_IMAGE_ROOT_LOCAL}${file.filename}`
      );

      req.body.portfolio_thumbnail = imgFileRoots[0];
      req.body.portfolio_img = imgFileRoots.slice(1);
    }

    if (fileList.length === 0) req.body.portfolio_img = [];

    const addPortfolio = new Portfolio.AddPortfolioDto(
      user_id,
      portfolio_title,
      portfolio_summary,
      portfolio_github,
      JSON.parse(portfolio_stacks),
      portfolio_description,
      JSON.parse(memberIds),
      fileList
    );

    console.log('addPortfolio : ', addPortfolio);

    validateDto(addPortfolio, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
