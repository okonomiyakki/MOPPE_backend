import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as commentPortfolioService from '../services/commentPortfolioService';
import * as CommentPortfolio from '../types/CommentPortfolioType';

/* 포트폴리오 댓글 등록 */
export const addCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id, comment_content } = req.body;

    if (!portfolio_id) AppErrors.handleBadRequest('portfolio_id를 입력해 주세요.');

    if (!comment_content) AppErrors.handleBadRequest('comment_content를 입력해 주세요.');

    if (isNaN(Number(portfolio_id)))
      AppErrors.handleBadRequest('유효한 portfolio_id를 입력해주세요.');

    if (typeof comment_content !== 'string')
      AppErrors.handleBadRequest('유효한 comment_content를 입력해주세요.');

    const inputData: CommentPortfolio.CreateInput = {
      user_id,
      portfolio_id,
      comment_content,
    };

    const createdCommentId: CommentPortfolio.Id = await commentPortfolioService.addComment(
      inputData
    );

    res.status(201).json({
      message: '포트폴리오 댓글 등록 성공',
      data: { comment_id: createdCommentId },
    });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
