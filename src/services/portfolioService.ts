import * as portfolioRepo from '../database/repository/portfolioRepo';
import * as Portfolio from '../types/PortfolioType';

/* 포트폴리오 등록 */
export const addPorfolio = async (inputData: Portfolio.CreateInput): Promise<Portfolio.Id> => {
  try {
    const createdPorfolioId: Portfolio.Id = await portfolioRepo.createPorfolio(inputData);

    return createdPorfolioId;
  } catch (error) {
    throw error;
  }
};
