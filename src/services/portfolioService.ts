import * as portfolioRepo from '../database/repository/portfolioRepo';
import * as Portfolio from '../types/PortfolioType';
import { generateNewDate } from '../utils/dateGenerator';

/* 포트폴리오 등록 */
export const addPorfolio = async (inputData: Portfolio.CreateInput): Promise<Portfolio.Id> => {
  try {
    const createdPorfolioId: Portfolio.Id = await portfolioRepo.createPorfolio(inputData);

    return createdPorfolioId;
  } catch (error) {
    throw error;
  }
};

// /* 포트폴리오 상세 정보 조회 */
// // TODO] 라우터 변경 한 다음 추가하기
// export const getPortfolioById = async (user_id: number, portfolio_id: number): Promise<any> => {
//   try {
//     const foundPortfolio = await portfolioRepo.findPortfolioById(portfolio_id);

//     // const foundBookmarkedUsers = await bookmarkRepo.findBookmarkedUsersById(portfolio_id);

//     // const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(user_id);

//     const currentKorDate = generateNewDate();

//     // const isUserEnteredCurrentDate = await portfolioRepo.findUserViewDateById(
//     //   user_id,
//     //   portfolio_id,
//     //   currentKorDate
//     // );

//     // if (!isUserEnteredCurrentDate) {
//     //   await portfolioRepo.updateProjectViewsCount(user_id, portfolio_id, currentKorDate);
//     // }

//     // const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.portfolio_id);

//     // const checkIsBookmarked = bookmarkedProjectIds.includes(portfolio_id)
//     //   ? { ...foundProject, project_bookmark_users: foundBookmarkedUsers, is_bookmarked: true }
//     //   : { ...foundProject, project_bookmark_users: foundBookmarkedUsers, is_bookmarked: false };

//     return checkIsBookmarked;
//   } catch (error) {
//     throw error;
//   }
// };
