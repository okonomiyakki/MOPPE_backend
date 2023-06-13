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
    const { memberIds } = req.body;
    const createReqBody = req.body;

    delete createReqBody.memberIds;

    createReqBody.portfolio_stacks = {
      stackList: JSON.parse(createReqBody.portfolio_stacks),
    };

    createReqBody.portfolio_img = {
      imgList: createReqBody.portfolio_img,
    };

    const inputData: Portfolio.CreateInput = { user_id, ...createReqBody };

    const createdPortfolioId: Portfolio.Id = await portfolioService.addPorfolio(
      inputData,
      JSON.parse(memberIds)
    );

    res
      .status(201)
      .json({ message: '포트폴리오 등록 성공', data: { portfolio_id: createdPortfolioId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 포트폴리오 상세 정보 수정 */
export const editPortfolioInfoHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.params;
    const { memberIds } = req.body;
    const updateReqBody = req.body;

    delete updateReqBody.memberIds;

    updateReqBody.portfolio_stacks = {
      stackList: JSON.parse(updateReqBody.portfolio_stacks),
    };

    if (updateReqBody.portfolio_img.length === 0) delete updateReqBody.portfolio_img;
    else
      updateReqBody.portfolio_img = {
        imgList: updateReqBody.portfolio_img,
      };

    const inputData: Portfolio.UpdateInput = updateReqBody;

    const updatedPortfolioId: Portfolio.Id = await portfolioService.editPortfolioInfo(
      user_id,
      Number(portfolio_id),
      inputData,
      JSON.parse(memberIds)
    );

    res.status(200).json({
      message: '포트폴리오 상세 정보 수정 성공',
      data: { portfolio_id: updatedPortfolioId },
    });
  } catch (error) {
    console.log(error);
    error instanceof AppError
      ? next(error)
      : next(AppErrors.handleInternalServerError('이미 존재하는 멤버 입니다.'));
  }
};

/* 포트폴리오 삭제 */
export const removePortfolioHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.params;

    const isDeletedPortfolio = await portfolioService.removePortfolio(
      user_id,
      Number(portfolio_id)
    );

    if (isDeletedPortfolio) res.status(200).json({ message: '포트폴리오 삭제 성공', data: {} });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 전체 포트폴리오 목록 조회 */
export const getAllPortfoliosHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { keyword, sort, page } = req.query;

    const portfolio_keyword = keyword === 'false' ? undefined : (keyword as string);

    const inputQuery: Portfolio.QueryInput = {
      portfolio_keyword,
      sort: sort as string,
      page: Number(page),
    };

    const pagenatedPortfoliosInfo = await portfolioService.getAllPortfolios(user_id, inputQuery);

    res.status(200).json({ message: '포트폴리오 목록 조회 성공', data: pagenatedPortfoliosInfo });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 포트폴리오 상세 정보 조회 */
export const getPortfolioByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.params;

    const portfolioInfo = await portfolioService.getPortfolioById(user_id, Number(portfolio_id));

    res.status(200).json({ message: '포트폴리오 상세 정보 조회 성공', data: portfolioInfo });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 다른 회원 마이페이지 작성 포트폴리오 목록 조회 */
export const getUserPortfoliosByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const my_user_id = req.user.user_id;
    const { page } = req.query;
    const { user_id } = req.params;

    const userPortfolios = await portfolioService.getMyPortfoliosById(
      my_user_id,
      Number(user_id),
      Number(page)
    );

    res.status(200).json({
      message: '다른 회원 마이페이지 작성 포트폴리오 목록 조회 성공',
      data: userPortfolios,
    });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 마이페이지 작성 포트폴리오 목록 조회 */
export const getMyPortfoliosByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { page } = req.query;

    const myPortfolios = await portfolioService.getMyPortfoliosById(user_id, user_id, Number(page));

    res
      .status(200)
      .json({ message: '마이페이지 작성 포트폴리오 목록 조회 성공', data: myPortfolios });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 마이페이지 북마크 포트폴리오 목록 조회 */
export const getMyBookmarkedPortfoliosByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { page } = req.query;

    const myPortfolios = await portfolioService.getMyBookmarkedPortfoliosById(
      user_id,
      Number(page)
    );

    res
      .status(200)
      .json({ message: '마이페이지 북마크 포트폴리오 목록 조회 성공', data: myPortfolios });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
