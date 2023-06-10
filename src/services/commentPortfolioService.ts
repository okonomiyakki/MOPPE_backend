import * as commentPortfolioRepo from '../database/repository/commentPortfolioRepo';
import * as portfolioRepo from '../database/repository/portfolioRepo';
import * as CommentPortfolio from '../types/CommentPortfolioType';
import { paginateList } from '../utils/paginator';

/* 댓글 등록 */
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
