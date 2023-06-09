import * as portfolioRepo from '../database/repository/portfolioRepo';
import * as bookmarkPortfolioRepo from '../database/repository/bookmarkPortfolioRepo';
import * as Portfolio from '../types/PortfolioType';
import { paginateList } from '../utils/paginator';
import { generateNewDate } from '../utils/dateGenerator';
import { searchPortfoliosByQuery } from '../utils/searchPortfolio';

/* 포트폴리오 등록 */
export const addPorfolio = async (inputData: Portfolio.CreateInput): Promise<Portfolio.Id> => {
  try {
    const createdPorfolioId: Portfolio.Id = await portfolioRepo.createPorfolio(inputData);

    return createdPorfolioId;
  } catch (error) {
    throw error;
  }
};

/* 전체 포트폴리오 목록 조회 */
export const getAllPortfolios = async (
  user_id: number,
  inputQuery: Portfolio.QueryInput
): Promise<any> => {
  try {
    const foundPortfolio = await searchPortfoliosByQuery(inputQuery); // TODO] 테스트 후 조건문 간소화 해야함

    const foundBookmarkedPortfolio = await bookmarkPortfolioRepo.findBookmarkedPortfolioById(
      user_id
    );

    const bookmarkedPortfolioIds = foundBookmarkedPortfolio.map(
      (portfolio: any) => portfolio.portfolio_id
    );

    const checkIsBookmarked: any = foundPortfolio.map((portfolio: any) => {
      if (bookmarkedPortfolioIds.includes(portfolio.portfolio_id))
        return { ...portfolio, is_bookmarked: true };
      else return { ...portfolio, is_bookmarked: false };
    });

    const pagenatedRowsInfo = paginateList(checkIsBookmarked, inputQuery.page, 9, true);

    const pagenatedPortfoliosInfo = {
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedPortfolio: pagenatedRowsInfo.pageRows,
    };

    return pagenatedPortfoliosInfo;
  } catch (error) {
    throw error;
  }
};

/* 포트폴리오 상세 정보 조회 */
export const getPortfolioById = async (user_id: number, portfolio_id: number): Promise<any> => {
  try {
    const foundPortfolio = await portfolioRepo.findPortfolioById(portfolio_id);

    const foundBookmarkedUsers = await bookmarkPortfolioRepo.findBookmarkedUsersById(portfolio_id);

    const foundBookmarkedPortfolios = await bookmarkPortfolioRepo.findBookmarkedPortfolioById(
      user_id
    );

    const currentKorDate = generateNewDate();

    const isUserEnteredCurrentDate = await portfolioRepo.findUserViewDateById(
      user_id,
      portfolio_id,
      currentKorDate
    );

    if (!isUserEnteredCurrentDate) {
      await portfolioRepo.updatePortfolioViewsCount(user_id, portfolio_id, currentKorDate);
    }

    const bookmarkedPortfolioIds = foundBookmarkedPortfolios.map(
      (portfolio: any) => portfolio.portfolio_id
    );

    const checkIsBookmarked = bookmarkedPortfolioIds.includes(portfolio_id)
      ? { ...foundPortfolio, portfolio_bookmark_users: foundBookmarkedUsers, is_bookmarked: true }
      : { ...foundPortfolio, portfolio_bookmark_users: foundBookmarkedUsers, is_bookmarked: false };

    // TODO] 참여한 멤버 정보 추가해야함

    return checkIsBookmarked;
  } catch (error) {
    throw error;
  }
};
