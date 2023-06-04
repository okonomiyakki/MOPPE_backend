import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import { AppError } from '../middlewares/errorHandler';
import * as commentService from '../services/commentService';

/* 마이페이지 회원 별 작성 댓글 목록 조회 */
export const getMyCommentsByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.user_id === 0)
      throw new AppError(403, '잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;

    const foundMyComments = await commentService.getMyCommentsById(user_id);

    res.status(200).json({
      message: '마이페이지 회원 별 작성 댓글 목록 조회 성공',
      data: { project_comments: [...foundMyComments] },
    });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 마이페이지 회원 별 작성 댓글 목록 조회 실패'));
    }
  }
};
