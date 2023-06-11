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
      memberIds,
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
      !portfolio_description ||
      !memberIds
    )
      AppErrors.handleBadRequest('요청 body에 모든 정보를 입력해 주세요.');

    // TODO] validator 에서 요청 body 타입 유효성 검사 추가

    const inputData: Portfolio.CreateInput = {
      user_id,
      portfolio_title,
      portfolio_summary,
      portfolio_thumbnail: thumbnail,
      portfolio_github,
      portfolio_stacks: { stackList: JSON.parse(portfolio_stacks) },
      portfolio_description,
      portfolio_img: { imgList: [...editortImg] },
    };

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
    const {
      portfolio_title,
      portfolio_summary,
      portfolio_github,
      portfolio_stacks,
      portfolio_description,
    } = req.body;
    const fileList = req.files || [];

    const imgFileRoots = (fileList as any[]).map((file) =>
      file === undefined ? '' : `http://localhost:5500/api/v1/static/portfolio/${file.filename}`
    );

    const thumbnail = imgFileRoots[0];
    const editortImg = imgFileRoots.slice(1);

    if (!portfolio_id) AppErrors.handleBadRequest('portfolio_id를 입력해 주세요.');

    if (
      !portfolio_title &&
      !portfolio_summary &&
      !portfolio_github &&
      !portfolio_stacks &&
      !portfolio_description
    )
      AppErrors.handleBadRequest('수정하실 정보를 하나 이상 입력해 주세요.');

    if (isNaN(Number(portfolio_id)))
      AppErrors.handleBadRequest('유효한 portfolio_id를 입력해주세요.');

    // TODO] validator 에서 요청 body 타입 유효성 검사 추가

    const inputData: Portfolio.UpdateInput = {
      portfolio_title,
      portfolio_summary,
      portfolio_thumbnail: thumbnail,
      portfolio_github,
      portfolio_stacks: { stackList: JSON.parse(portfolio_stacks) },
      portfolio_description,
      portfolio_img: { imgList: [...editortImg] },
    };

    const updatedPortfolioId: Portfolio.Id = await portfolioService.editPortfolioInfo(
      user_id,
      Number(portfolio_id),
      inputData
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

    if (!portfolio_id) AppErrors.handleBadRequest('portfolio_id를 입력해 주세요.');

    if (isNaN(Number(portfolio_id)))
      AppErrors.handleBadRequest('유효한 portfolio_id를 입력해주세요.');

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
    const { keyword, page } = req.query;

    if (!keyword || !page) AppErrors.handleBadRequest('요청 query에 모든 정보를 입력해 주세요.');

    // TODO] validator 에서 요청 query 타입 유효성 검사 추가

    const portfolio_keyword = keyword === 'false' ? undefined : (keyword as string);

    const inputQuery: Portfolio.QueryInput = {
      portfolio_keyword,
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

    if (!portfolio_id) AppErrors.handleBadRequest('portfolio_id를 입력해 주세요.');

    if (isNaN(Number(portfolio_id)))
      AppErrors.handleBadRequest('유효한 portfolio_id를 입력해주세요.');

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
    if (req.user.user_id === 0)
      AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const my_user_id = req.user.user_id;
    const { page } = req.query;
    const { user_id } = req.params;

    if (!page) AppErrors.handleBadRequest('page를 입력해주세요.');

    if (!user_id) AppErrors.handleBadRequest('user_id를 입력해주세요.');

    if (isNaN(Number(page))) AppErrors.handleBadRequest('유효한 page를 입력해주세요.');

    if (isNaN(Number(user_id))) AppErrors.handleBadRequest('유효한 user_id를 입력해주세요.');

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
    if (req.user.user_id === 0)
      AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;
    const { page } = req.query;

    if (!page) AppErrors.handleBadRequest('page를 입력해주세요.');

    if (isNaN(Number(page))) AppErrors.handleBadRequest('유효한 page를 입력해주세요.');

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
    if (req.user.user_id === 0)
      AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;
    const { page } = req.query;

    if (!page) AppErrors.handleBadRequest('page를 입력해주세요.');

    if (isNaN(Number(page))) AppErrors.handleBadRequest('유효한 page를 입력해주세요.');

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
