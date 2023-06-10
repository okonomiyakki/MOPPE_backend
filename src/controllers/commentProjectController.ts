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

    if (!project_id) AppErrors.handleBadRequest('project_id를 입력해 주세요.');

    if (!comment_content) AppErrors.handleBadRequest('comment_content를 입력해 주세요.');

    if (isNaN(Number(project_id))) AppErrors.handleBadRequest('유효한 project_id를 입력해주세요.');

    if (typeof comment_content !== 'string')
      AppErrors.handleBadRequest('유효한 comment_content를 입력해주세요.');

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

    if (!comment_id) AppErrors.handleBadRequest('comment_id를 입력해 주세요.');

    if (!comment_content) AppErrors.handleBadRequest('comment_content를 입력해 주세요.');

    if (isNaN(Number(comment_id))) AppErrors.handleBadRequest('유효한 comment_id를 입력해주세요.');

    if (typeof comment_content !== 'string')
      AppErrors.handleBadRequest('유효한 comment_content를 입력해주세요.');

    const inputData: CommentProject.UpdateCommentInput = {
      comment_content,
    };

    const updatedCommentId: CommentProject.Id = await commentProjectService.editComment(
      user_id,
      Number(comment_id),
      inputData
    );

    res.status(200).json({ message: '댓글 수정 성공', data: { comment_id: updatedCommentId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 댓글 삭제 */
export const removeCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { comment_id } = req.params;

    if (!comment_id) AppErrors.handleBadRequest('comment_id를 입력해 주세요.');

    if (isNaN(Number(comment_id))) AppErrors.handleBadRequest('유효한 comment_id를 입력해주세요.');

    const isDeletedComment = await commentProjectService.removeComment(user_id, Number(comment_id));

    if (isDeletedComment) res.status(200).json({ message: '댓글 삭제 성공', data: {} });
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

    if (!project_id) AppErrors.handleBadRequest('project_id를 입력해주세요.');

    if (!page) AppErrors.handleBadRequest('page를 입력해주세요.');

    if (isNaN(Number(project_id))) AppErrors.handleBadRequest('유효한 project_id를 입력해주세요.');

    if (isNaN(Number(page))) AppErrors.handleBadRequest('유효한 page를 입력해주세요.');

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
    if (req.user.user_id === 0)
      throw new AppError(403, '잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;
    const { page } = req.query;

    if (!page) AppErrors.handleBadRequest('page를 입력해주세요.');

    if (isNaN(Number(page))) AppErrors.handleBadRequest('유효한 page를 입력해주세요.');

    const myComments = await commentProjectService.getMyCommentsById(user_id, Number(page));

    res.status(200).json({
      message: '마이페이지 작성 댓글 목록 조회 성공',
      data: myComments,
    });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
