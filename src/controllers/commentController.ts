import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import { AppError } from '../middlewares/errorHandler';
import * as commentService from '../services/commentService';
import * as C from '../types/commentType';

/* 댓글 등록 - 기능 추가 시 수정 필요 */
export const addCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { project_id, comment_content } = req.body;
    /* const { project_id, qna_id, comment_content } = req.body; // qna 기능 추가 시 할당 */

    if (!project_id) throw new AppError(400, 'project_id를 입력해 주세요.');

    if (!comment_content) throw new AppError(400, 'comment_content를 입력해 주세요.');

    const commentLocation = project_id !== 0 ? '모집 글' : 'QnA';

    const inputData: C.CreateCommentInput = {
      user_id,
      project_id: project_id || 0,
      /* qna_id: qna_id || 0, // qna 기능 추가 시 할당 */
      comment_content,
    };

    const createdCommentId: C.Id = await commentService.addComment(inputData);

    res.status(201).json({
      message: `${commentLocation} 댓글 등록 성공`,
      data: { comment_id: createdCommentId },
    });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 등록 실패'));
    }
  }
};

/* 댓글 수정 */
export const editCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { comment_id } = req.params;
    const { comment_content } = req.body;

    if (!comment_id) throw new AppError(400, 'comment_id를 입력해 주세요.');

    if (!comment_content) throw new AppError(400, 'comment_content를 입력해 주세요.');

    const inputData: C.UpdateCommentInput = {
      comment_content,
    };

    const updatedCommentId: C.Id = await commentService.editComment(
      user_id,
      Number(comment_id),
      inputData
    );

    res.status(201).json({ message: '댓글 수정 성공', data: { comment_id: updatedCommentId } });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 수정 실패'));
    }
  }
};

/* 댓글 삭제 */
export const removeCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { comment_id } = req.params;

    if (!comment_id) throw new AppError(400, 'comment_id를 입력해 주세요.');

    const isDeletedComment = await commentService.removeComment(user_id, Number(comment_id));

    if (isDeletedComment) res.status(201).json({ message: '댓글 삭제 성공', data: {} });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 삭제 실패'));
    }
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

    if (!project_id) throw new AppError(400, 'project_id를 입력해주세요.');

    const foundComments = await commentService.getProjectCommentsById(Number(project_id));

    res.status(200).json({ message: '모집 글 별 댓글 목록 조회 성공', data: foundComments });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 모집 글 별 댓글 목록 조회 실패'));
    }
  }
};

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
