import { AppError } from '../middlewares/errorHandler';
import * as commentRepo from '../database/repository/commentRepo';
import * as Comment from '../types/commentType';
import { paginateList } from '../utils/paginator';

/* 댓글 등록 */
export const addComment = async (inputData: Comment.CreateCommentInput): Promise<Comment.Id> => {
  try {
    const createdCommentId: Comment.Id = await commentRepo.createComment(inputData);

    return createdCommentId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 댓글 수정 */
export const editComment = async (
  user_id: number,
  comment_id: number,
  inputData: Comment.UpdateCommentInput
): Promise<any> => {
  try {
    await commentRepo.findProjectById(comment_id);

    const updatedCommentId = await commentRepo.updateComment(user_id, comment_id, inputData);

    return updatedCommentId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 댓글 삭제 */
export const removeComment = async (user_id: number, comment_id: number): Promise<boolean> => {
  try {
    await commentRepo.findProjectById(comment_id);

    const isDeletedComment = await commentRepo.deleteCommentById(user_id, comment_id);

    return isDeletedComment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 모집 글 별 댓글 목록 조회 */
export const getProjectCommentsById = async (project_id: number, page: number): Promise<any> => {
  try {
    const foundComments = await commentRepo.findProjectCommentsById(project_id);

    const pagenatedComments = paginateList(foundComments, page, 10, false);

    const pageSize = Math.ceil(foundComments.length / 10); // TODO] 유틸로 옮기기

    const pagenatedCommentsInfo = {
      listLength: foundComments.length,
      pageSize,
      pagenatedComments,
    };

    return pagenatedCommentsInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 마이페이지 작성 댓글 목록 조회 */
export const getMyCommentsById = async (user_id: number, page: number): Promise<any> => {
  try {
    const foundComments = await commentRepo.findMyCommentsById(user_id);

    const pagenatedComments = paginateList(foundComments, page, 5, true);

    const pageSize = Math.ceil(foundComments.length / 5); // TODO] 유틸로 옮기기

    const pagenatedCommentsInfo = {
      listLength: foundComments.length,
      pageSize,
      pagenatedComments,
    };

    return pagenatedCommentsInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
