import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as Portfolio from '../types/PortfolioType';
import * as portfolioService from '../services/portfolioService';

/* 포트폴리오 등록 */
export const addPortfolioHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const {
      portfolio_title,
      portfolio_summary,
      portfolio_github,
      portfolio_stacks,
      portfolio_description,
    } = req.body;
    const fileList = req.files || []; // 이미지 배열

    console.log('fileList : ', fileList);

    const imgFileRoots = (fileList as any[]).map(
      (file) => `http://localhost:5500/api/v1/static/portfolio/${file.filename}`
    );

    const thumbnail = imgFileRoots[0];
    const editortImg = imgFileRoots.slice(1);

    if (
      !portfolio_title ||
      !portfolio_summary ||
      !portfolio_github ||
      !portfolio_stacks ||
      !portfolio_description
    )
      AppErrors.handleBadRequest('요청 body에 모든 정보를 입력해 주세요.');

    // TODO] validator 에서 요청 body 타입 유효성 검사 추가

    const inputData: Portfolio.CreateInput = {
      user_id,
      portfolio_title,
      portfolio_summary,
      portfolio_thumbnail: thumbnail,
      portfolio_github,
      portfolio_stacks,
      portfolio_description,
      portfolio_img: {
        imgList: [...editortImg],
      },
    };

    const createdPortfolioId: Portfolio.Id = await portfolioService.addPorfolio(inputData);

    res
      .status(201)
      .json({ message: '포트폴리오 등록 성공', data: { portfolio_id: createdPortfolioId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
