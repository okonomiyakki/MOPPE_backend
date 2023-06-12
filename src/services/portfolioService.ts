import * as portfolioRepo from '../database/repository/portfolioRepo';
import * as bookmarkPortfolioRepo from '../database/repository/bookmarkPortfolioRepo';
import * as memberRepo from '../database/repository/memberRepo';
import * as Portfolio from '../types/PortfolioType';
import { paginateList } from '../utils/paginator';
import { generateNewDate } from '../utils/dateGenerator';
import { searchPortfoliosByQuery } from '../utils/searchPortfolio';
import { sortPortfoliosByBookmarkCount } from '../utils/sortPortfolios';

/* 포트폴리오 등록 */
export const addPorfolio = async (
  inputData: Portfolio.CreateInput,
  memberIds: number[]
): Promise<Portfolio.Id> => {
  try {
    const createdPorfolioId: Portfolio.Id = await portfolioRepo.createPorfolio(inputData);

    for (const userId of memberIds) {
      await memberRepo.createMembers(userId, createdPorfolioId);
    }

    return createdPorfolioId;
  } catch (error) {
    throw error;
  }
};

/* 포트폴리오 상세 정보 수정 */
export const editPortfolioInfo = async (
  user_id: number,
  portfolio_id: number,
  inputData: Portfolio.UpdateInput,
  memberIds: number[]
): Promise<any> => {
  try {
    const updatedPortfolioId = await portfolioRepo.updatePortfolioInfo(
      user_id,
      portfolio_id,
      inputData
    );

    await memberRepo.deleteMembers(portfolio_id);

    for (const userId of memberIds) {
      await memberRepo.createMembers(userId, portfolio_id);
    }

    return updatedPortfolioId;
  } catch (error) {
    throw error;
  }
};

/* 포트폴리오 삭제 */
export const removePortfolio = async (user_id: number, portfolio_id: number): Promise<boolean> => {
  try {
    const isDeletedPortfolio = await portfolioRepo.deletePortfolioById(user_id, portfolio_id);

    return isDeletedPortfolio;
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
    const foundPortfolios = await searchPortfoliosByQuery(inputQuery); // TODO] 테스트 후 조건문 간소화 해야함

    const foundBookmarkedPortfolio = await bookmarkPortfolioRepo.findBookmarkedPortfoliosById(
      user_id
    );

    const bookmarkedPortfolioIds = foundBookmarkedPortfolio.map(
      (portfolio: any) => portfolio.portfolio_id
    );

    const checkIsBookmarked: any = foundPortfolios.map((portfolio: any) => {
      if (bookmarkedPortfolioIds.includes(portfolio.portfolio_id))
        return { ...portfolio, is_bookmarked: true };
      else return { ...portfolio, is_bookmarked: false };
    });

    const sortedPortfolios = sortPortfoliosByBookmarkCount(checkIsBookmarked, inputQuery.sort);

    const pagenatedRowsInfo = paginateList(sortedPortfolios, inputQuery.page, 9, !inputQuery.sort);

    const pagenatedPortfoliosInfo = {
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedPortfolios: pagenatedRowsInfo.pageRows,
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

    const foundBookmarkedPortfolios = await bookmarkPortfolioRepo.findBookmarkedPortfoliosById(
      user_id
    );

    const foundParticipatedMembers = await memberRepo.findParticipatedMembersById(portfolio_id);

    if (user_id !== 0) {
      const currentKorDate = generateNewDate();

      const isUserEnteredCurrentDate = await portfolioRepo.findUserViewDateById(
        user_id,
        portfolio_id,
        currentKorDate
      );

      if (!isUserEnteredCurrentDate) {
        await portfolioRepo.updatePortfolioViewsCount(user_id, portfolio_id, currentKorDate);
      }
    }

    const bookmarkedPortfolioIds = foundBookmarkedPortfolios.map(
      (portfolio: any) => portfolio.portfolio_id
    );

    const checkIsBookmarked = bookmarkedPortfolioIds.includes(portfolio_id)
      ? {
          ...foundPortfolio,
          participated_members: foundParticipatedMembers,
          portfolio_bookmark_users: foundBookmarkedUsers,
          is_bookmarked: true,
        }
      : {
          ...foundPortfolio,
          participated_members: foundParticipatedMembers,
          portfolio_bookmark_users: foundBookmarkedUsers,
          is_bookmarked: false,
        };

    return checkIsBookmarked;
  } catch (error) {
    throw error;
  }
};

/* 마이페이지 작성 포트폴리오 목록 조회 */
export const getMyPortfoliosById = async (
  my_user_id: number,
  user_id: number,
  page: number
): Promise<any> => {
  try {
    const foundMyPortfolios = await portfolioRepo.findMyPortfoliosById(user_id);

    /* 다른사람 마이페이지에 들어갔을때, 게시글의 북마크 여부는 방문자 기준 */
    const foundBookmarkedPortfolio = await bookmarkPortfolioRepo.findBookmarkedPortfoliosById(
      my_user_id
    );

    const bookmarkedPortfolioIds = foundBookmarkedPortfolio.map(
      (portfolio: any) => portfolio.portfolio_id
    );

    const checkIsBookmarked: any = foundMyPortfolios.map((portfolio: any) => {
      if (bookmarkedPortfolioIds.includes(portfolio.portfolio_id))
        return { ...portfolio, is_bookmarked: true };
      else return { ...portfolio, is_bookmarked: false };
    });

    const pagenatedRowsInfo = paginateList(checkIsBookmarked, page, 5, true);

    const pagenatedPortfoliosInfo = {
      listLength: checkIsBookmarked.length,
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedPortfolios: pagenatedRowsInfo.pageRows,
    };

    return pagenatedPortfoliosInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 마이페이지 북마크 포트폴리오 목록 조회 */
export const getMyBookmarkedPortfoliosById = async (
  user_id: number,
  page: number
): Promise<any> => {
  try {
    const foundMyBookmarkedPortfolios = await portfolioRepo.findMyBookmarkedPortfoliosById(user_id);

    const addIsBookmarked = foundMyBookmarkedPortfolios.map((portfolio: any) => {
      return { ...portfolio, is_bookmarked: true };
    });

    const pagenatedRowsInfo = paginateList(addIsBookmarked, page, 5, true);

    const pagenatedPortfoliosInfo = {
      listLength: addIsBookmarked.length,
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedPortfolios: pagenatedRowsInfo.pageRows,
    };

    return pagenatedPortfoliosInfo;
  } catch (error) {
    throw error;
  }
};
