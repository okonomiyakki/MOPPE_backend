import { AppError } from '../middlewares/errorHandler';
import * as commentRepo from '../database/repository/commentRepo';
import * as Comment from '../types/commentType';
import { paginateList } from '../utils/paginator';

/* 댓글 등록 */
export const addComment = async (inputData: Comment.CreateCommentInput): Promise<Comment.Id> => {
  try {
    const createdCommentId: Comment.Id = await commentRepo.createComment(inputData);

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

/* 댓글 수정 */
export const editComment = async (
  user_id: number,
  comment_id: number,
  inputData: Comment.UpdateCommentInput
): Promise<any> => {
  try {
    // 모집 글 목록이 존재하는지 확인 후 없으면 에러 처리

    // comment_id에 해당하는 user_id 일치 여부 에러 처리 (본인만 수정 가능)

    const updatedCommentId = await commentRepo.updateComment(comment_id, inputData);

    return updatedCommentId;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 댓글 수정 실패');
    }
  }
};

/* 댓글 삭제 */
export const removeComment = async (user_id: number, comment_id: number): Promise<boolean> => {
  try {
    // 모집 글 목록이 존재하는지 확인 후 없으면 에러 처리

    // comment_id에 해당하는 user_id 일치 여부 에러 처리 (본인만 삭제 가능)

    const isDeletedComment = await commentRepo.deleteCommentById(comment_id);

    return isDeletedComment;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 댓글 삭제 실패');
    }
  }
};

/* 모집 글 별 댓글 목록 조회 */
export const getProjectCommentsById = async (project_id: number, page: number): Promise<any> => {
  try {
    const foundComments = await commentRepo.findProjectCommentsById(project_id);

    // 모집 글이 존재하는지 확인 후 없으면 에러 처리

    // 댓글 목록이 존재하는지 확인 후 없으면 에러 처리

    const pagenatedComments = paginateList(foundComments, page);

    const pageSize = Math.ceil(foundComments.length / 10); // TODO] 유틸로 옮기기

    const pagenatedCommentsInfo = {
      pageSize,
      pagenatedComments,
    };

    return pagenatedCommentsInfo;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 모집 글 별 댓글 목록 조회 실패');
    }
  }
};

/* 마이페이지 회원 별 작성 댓글 목록 조회 */
export const getMyCommentsById = async (user_id: number, page: number): Promise<any> => {
  try {
    const foundComments = await commentRepo.findMyCommentsById(user_id);

    // 댓글 목록이 존재하는지 확인 후 없으면 에러 처리

    const pagenatedComments = paginateList(foundComments, page);

    const pageSize = Math.ceil(foundComments.length / 10); // TODO] 유틸로 옮기기

    const pagenatedCommentsInfo = {
      listLength: foundComments.length,
      pageSize,
      pagenatedComments,
    };

    return pagenatedCommentsInfo;
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
