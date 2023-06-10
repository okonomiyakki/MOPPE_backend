import * as commentProjectRepo from '../database/repository/commentProjectRepo';
import * as projectRepo from '../database/repository/projectRepo';
import * as CommentProject from '../types/CommentProjectType';
import { paginateList } from '../utils/paginator';

/* 댓글 등록 */
export const addComment = async (
  inputData: CommentProject.CreateCommentInput
): Promise<CommentProject.Id> => {
  try {
    await projectRepo.isProjectValid(inputData.project_id);

    const createdCommentId: CommentProject.Id = await commentProjectRepo.createComment(inputData);

    return createdCommentId;
  } catch (error) {
    throw error;
  }
};

/* 댓글 수정 */
export const editComment = async (
  user_id: number,
  comment_id: number,
  inputData: CommentProject.UpdateCommentInput
): Promise<any> => {
  try {
    await commentProjectRepo.isProjectValid(comment_id);

    const updatedCommentId = await commentProjectRepo.updateComment(user_id, comment_id, inputData);

    return updatedCommentId;
  } catch (error) {
    throw error;
  }
};

/* 댓글 삭제 */
export const removeComment = async (user_id: number, comment_id: number): Promise<boolean> => {
  try {
    await commentProjectRepo.isProjectValid(comment_id);

    const isDeletedComment = await commentProjectRepo.deleteCommentById(user_id, comment_id);

    return isDeletedComment;
  } catch (error) {
    throw error;
  }
};

/* 모집 글 별 댓글 목록 조회 */
export const getProjectCommentsById = async (project_id: number, page: number): Promise<any> => {
  try {
    const foundComments = await commentProjectRepo.findProjectCommentsById(project_id);

    const pagenatedRowsInfo = paginateList(foundComments, page, 10, false);

    const pagenatedCommentsInfo = {
      listLength: foundComments.length,
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedComments: pagenatedRowsInfo.pageRows,
    };

    return pagenatedCommentsInfo;
  } catch (error) {
    throw error;
  }
};

/* 마이페이지 작성 댓글 목록 조회 */
export const getMyCommentsById = async (user_id: number, page: number): Promise<any> => {
  try {
    const foundComments = await commentProjectRepo.findMyCommentsById(user_id);

    const pagenatedRowsInfo = paginateList(foundComments, page, 5, true);

    const pagenatedCommentsInfo = {
      listLength: foundComments.length,
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedComments: pagenatedRowsInfo.pageRows,
    };

    return pagenatedCommentsInfo;
  } catch (error) {
    throw error;
  }
};
