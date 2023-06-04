import { AppError } from '../middlewares/errorHandler';
import * as commentRepo from '../database/repository/commentRepo';
import * as C from '../types/commentType';

/* 댓글 등록 */
export const addComment = async (inputData: C.CreateCommentInput): Promise<C.Id> => {
  try {
    const createdCommentId: C.Id = await commentRepo.createComment(inputData);

    // 같은 아이디로 연속적인 댓글 등록 요청 에러 반환 추가하기

    return createdCommentId;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 댓글 등록 실패');
    }
  }
};

/* 마이페이지 회원 별 작성 댓글 목록 조회 */
export const getMyCommentsById = async (user_id: number): Promise<any> => {
  try {
    const foundComments = await commentRepo.findMyCommentsById(user_id);

    // 모집 글 목록이 존재하는지 확인 후 없으면 에러 처리

    return foundComments;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 마이페이지 회원 별 작성 댓글 목록 조회 실패');
    }
  }
};
