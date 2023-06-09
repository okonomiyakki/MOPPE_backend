import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as bookmarkService from '../services/bookmarkService';
import * as Bookmark from '../types/BookmarkType';

/* 북마크 등록 - 기능 추가 시 수정 필요 */
export const addBookmarkHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.body;

    if (!project_id) AppErrors.handleBadRequest('project_id를 입력해 주세요.');

    if (isNaN(Number(project_id))) AppErrors.handleBadRequest('유효한 project_id를 입력해주세요.');

    const inputData: Bookmark.CreateInput = {
      user_id,
      project_id: project_id || 0,
    };

    const createdBookmarkId: Bookmark.Id = await bookmarkService.addBookmark(inputData);

    res.status(201).json({
      message: '모집 글 북마크 등록 성공',
      data: { bookmark_id: createdBookmarkId },
    });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 북마크 삭제 */
export const removeBookmarkHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.params;

    if (!project_id) AppErrors.handleBadRequest('project_id를 입력해 주세요.');

    if (isNaN(Number(project_id))) AppErrors.handleBadRequest('유효한 project_id를 입력해주세요.');

    const isDeletedBookmark = await bookmarkService.removeBookmark(user_id, Number(project_id));

    if (isDeletedBookmark) res.status(200).json({ message: '북마크 삭제 성공', data: {} });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
