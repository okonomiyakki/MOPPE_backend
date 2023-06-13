import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as commentProjectService from '../services/commentProjectService';
import * as CommentProject from '../types/CommentProjectType';

/* 댓글 등록 */
export const addCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { project_id, comment_content } = req.body;

    const inputData: CommentProject.CreateCommentInput = {
      user_id,
      project_id,
      comment_content,
    };

    const createdCommentId: CommentProject.Id = await commentProjectService.addComment(inputData);

    res.status(201).json({
      message: '모집 글 댓글 등록 성공',
      data: { comment_id: createdCommentId },
    });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 댓글 수정 */
export const editCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { comment_id } = req.params;
    const { comment_content } = req.body;

    const inputData: CommentProject.UpdateCommentInput = {
      comment_content,
    };

    const updatedCommentId: CommentProject.Id = await commentProjectService.editComment(
      user_id,
      Number(comment_id),
      inputData
    );

    res
      .status(200)
      .json({ message: '모집 글 댓글 수정 성공', data: { comment_id: updatedCommentId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 댓글 삭제 */
export const removeCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { comment_id } = req.params;

    const isDeletedComment = await commentProjectService.removeComment(user_id, Number(comment_id));

    if (isDeletedComment) res.status(200).json({ message: '모집 글 댓글 삭제 성공', data: {} });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 모집 글 별 댓글 목록 조회 */
export const getProjectCommentsByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { project_id } = req.params;
    const { page } = req.query;

    const projectComments = await commentProjectService.getProjectCommentsById(
      Number(project_id),
      Number(page)
    );

    res.status(200).json({ message: '모집 글 별 댓글 목록 조회 성공', data: projectComments });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 마이페이지 작성 댓글 목록 조회 */
export const getMyCommentsByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { page } = req.query;

    const myComments = await commentProjectService.getMyCommentsById(user_id, Number(page));

    res.status(200).json({
      message: '마이페이지 모집 글 작성 댓글 목록 조회 성공',
      data: myComments,
    });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
