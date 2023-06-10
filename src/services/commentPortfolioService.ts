import * as commentPortfolioRepo from '../database/repository/commentPortfolioRepo';
import * as portfolioRepo from '../database/repository/portfolioRepo';
import * as CommentPortfolio from '../types/CommentPortfolioType';
import { paginateList } from '../utils/paginator';

/* 포트폴리오 댓글 등록 */
export const addComment = async (
  inputData: CommentPortfolio.CreateInput
): Promise<CommentPortfolio.Id> => {
  try {
    await portfolioRepo.isPortfolioValid(inputData.portfolio_id);

    const createdCommentId: CommentPortfolio.Id = await commentPortfolioRepo.createComment(
      inputData
    );

    return createdCommentId;
  } catch (error) {
    throw error;
  }
};

/* 포트폴리오 댓글 수정 */
export const editComment = async (
  user_id: number,
  comment_id: number,
  inputData: CommentPortfolio.UpdateInput
): Promise<any> => {
  try {
    await commentPortfolioRepo.isPortfolioValid(comment_id);

    const updatedCommentId = await commentPortfolioRepo.updateComment(
      user_id,
      comment_id,
      inputData
    );

    return updatedCommentId;
  } catch (error) {
    throw error;
  }
};

/* 포트폴리오 댓글 삭제 */
export const removeComment = async (user_id: number, comment_id: number): Promise<boolean> => {
  try {
    await commentPortfolioRepo.isPortfolioValid(comment_id);

    const isDeletedComment = await commentPortfolioRepo.deleteCommentById(user_id, comment_id);

    return isDeletedComment;
  } catch (error) {
    throw error;
  }
};
