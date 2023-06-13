import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validateDto } from '../../utils/dtoValidator';
import * as AppErrors from '../../middlewares/errorHandler';
import * as Bookmark from '../../database/dtos/bookmarkDto';

export const addProjectBookmarkValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.body;

    const addProjectBookmark = new Bookmark.AddProjectBookmarkDto(user_id, project_id);

    validateDto(addProjectBookmark, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const addPortfolioBookmarkValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.body;

    const addPortfolioBookmark = new Bookmark.AddPortfolioBookmarkDto(user_id, portfolio_id);

    validateDto(addPortfolioBookmark, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const removeProjectBookmarkValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.params;

    const removeProjectBookmark = new Bookmark.RemoveProjectBookmarkDto(
      user_id,
      Number(project_id)
    );

    validateDto(removeProjectBookmark, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const removePortfolioBookmarkValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.params;

    const removePortfolioBookmark = new Bookmark.RemovePortfolioBookmarkDto(
      user_id,
      Number(portfolio_id)
    );

    validateDto(removePortfolioBookmark, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
