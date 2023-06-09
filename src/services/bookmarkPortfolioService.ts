import * as AppErrors from '../middlewares/errorHandler';
import * as bookmarkPortfolioRepo from '../database/repository/bookmarkPortfolioRepo';
import * as projectRepo from '../database/repository/projectRepo';
import * as BookmarkPortfolio from '../types/BookmarkPortfolioType';

/* 포트폴리오 북마크 등록 */
export const addBookmark = async (inputData: BookmarkPortfolio.CreateInput): Promise<any> => {
  try {
    // await projectRepo.isPortfolioValid(inputData.portfolio_id);

    const foundBookmarkedPortfolios = await bookmarkPortfolioRepo.findBookmarkedPortfolioById(
      inputData.user_id
    );

    const bookmarkedPortfolioIds = foundBookmarkedPortfolios.map(
      (portfolio: any) => portfolio.portfolio_id
    );

    const isBookmarked = bookmarkedPortfolioIds.includes(inputData.portfolio_id) ? true : false;

    if (isBookmarked) AppErrors.handleBadRequest('이미 북마크된 모집 글 입니다.');

    const createdBookmarkId: BookmarkPortfolio.Id = await bookmarkPortfolioRepo.createBookmark(
      inputData
    );

    return createdBookmarkId;
  } catch (error) {
    throw error;
  }
};
