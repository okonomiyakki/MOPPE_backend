import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as bookmarkPortfolioService from '../services/bookmarkPortfolioService';
import * as BookmarkPortfolio from '../types/BookmarkPortfolioType';

/* 포트폴리오 북마크 등록 */
export const addBookmarkHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.body;

    if (!portfolio_id) AppErrors.handleBadRequest('portfolio_id를 입력해 주세요.');

    if (isNaN(Number(portfolio_id)))
      AppErrors.handleBadRequest('유효한 portfolio_id를 입력해주세요.');

    const inputData: BookmarkPortfolio.CreateInput = {
      user_id,
      portfolio_id,
    };

    const createdBookmarkId: BookmarkPortfolio.Id = await bookmarkPortfolioService.addBookmark(
      inputData
    );

    res.status(201).json({
      message: '포트폴리오 북마크 등록 성공',
      data: { bookmark_id: createdBookmarkId },
    });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 포트폴리오 북마크 삭제 */
export const removeBookmarkHandler = async (
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

    const isDeletedBookmark = await bookmarkPortfolioService.removeBookmark(
      user_id,
      Number(portfolio_id)
    );

    if (isDeletedBookmark)
      res.status(200).json({ message: '포트폴리오 북마크 삭제 성공', data: {} });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
