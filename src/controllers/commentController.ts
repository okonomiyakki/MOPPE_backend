import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import { AppError } from '../middlewares/errorHandler';
import * as commentService from '../services/commentService';
import * as Comment from '../types/commentType';

/* 댓글 등록 - 기능 추가 시 수정 필요 */
export const addCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { project_id, comment_content } = req.body;
    // TODO] qna 기능 추가 시 할당
    // const { project_id, qna_id, comment_content } = req.body;
    // (project 댓글일때는 validator 에서 qna_id = undefiend | null 체크 후 컨트롤러에서 0으로 바꾸기)

    if (!project_id) throw new AppError(400, 'project_id를 입력해 주세요.');

    if (!comment_content) throw new AppError(400, 'comment_content를 입력해 주세요.');

    const commentLocation = project_id !== 0 ? '모집 글' : 'QnA';

    const inputData: Comment.CreateCommentInput = {
      user_id,
      project_id: project_id || 0,
      /* qna_id: qna_id || 0, // qna 기능 추가 시 할당 */
      comment_content,
    };

    const createdCommentId: Comment.Id = await commentService.addComment(inputData);

    res.status(201).json({
      message: `${commentLocation} 댓글 등록 성공`,
      data: { comment_id: createdCommentId },
    });
  } catch (error) {
    console.log(error);
    next(error);
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

    const inputData: Comment.UpdateCommentInput = {
      comment_content,
    };

    const updatedCommentId: Comment.Id = await commentService.editComment(
      user_id,
      Number(comment_id),
      inputData
    );

    res.status(200).json({ message: '댓글 수정 성공', data: { comment_id: updatedCommentId } });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* 댓글 삭제 */
export const removeCommentHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { comment_id } = req.params;

    if (!comment_id) throw new AppError(400, 'comment_id를 입력해 주세요.');

    const isDeletedComment = await commentService.removeComment(user_id, Number(comment_id));

    if (isDeletedComment) res.status(200).json({ message: '댓글 삭제 성공', data: {} });
  } catch (error) {
    console.log(error);
    next(error);
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

    if (!project_id) throw new AppError(400, 'project_id를 입력해주세요.');

    if (!page) throw new AppError(400, 'page를 입력해주세요.');

    const projectComments = await commentService.getProjectCommentsById(
      Number(project_id),
      Number(page)
    );

    res.status(200).json({ message: '모집 글 별 댓글 목록 조회 성공', data: projectComments });
  } catch (error) {
    console.log(error);
    next(error);
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

    if (!page) throw new AppError(400, 'page를 입력해주세요.');

    const myComments = await commentService.getMyCommentsById(user_id, Number(page));

    res.status(200).json({
      message: '마이페이지 작성 댓글 목록 조회 성공',
      data: myComments,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
