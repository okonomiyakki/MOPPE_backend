import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validateDto } from '../../utils/dtoValidator';
import * as AppErrors from '../../middlewares/errorHandler';
import * as Comment from '../../database/dtos/commentDto';

export const addProjectCommentValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id, comment_content } = req.body;

    const addProjectComment = new Comment.AddProjectCommentDto(
      user_id,
      project_id,
      comment_content
    );

    validateDto(addProjectComment, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const addPortfolioCommentValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id, comment_content } = req.body;

    const addPortfolioComment = new Comment.AddPortfolioCommentDto(
      user_id,
      portfolio_id,
      comment_content
    );

    validateDto(addPortfolioComment, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const editCommentValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { comment_id } = req.params;
    const { comment_content } = req.body;

    const editComment = new Comment.EditCommentDto(user_id, Number(comment_id), comment_content);

    validateDto(editComment, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const removeCommentValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { comment_id } = req.params;

    const removeComment = new Comment.RemoveCommentDto(user_id, Number(comment_id));

    validateDto(removeComment, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const getMyCommentsByIdValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { page } = req.query;

    if (user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    const getMyCommentsById = new Comment.GetMyCommentsByIdDto(user_id, Number(page));

    validateDto(getMyCommentsById, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
