import * as AppErrors from '../middlewares/errorHandler';

export const sortPortfoliosByBookmarkCount = (portfolios: any[], sorting: string) => {
  try {
    if (sorting === 'true') {
      const sortedPortfolios = portfolios.sort(
        (a, b) => parseInt(b.portfolio_bookmark_count) - parseInt(a.portfolio_bookmark_count)
      );
      return sortedPortfolios;
    } else if (sorting === 'false') {
      return portfolios;
    } else throw AppErrors.handleBadRequest('포트폴리오 북마크순 정렬 중 오류가 발생했습니다.');
  } catch (error) {
    console.log(error);
    throw error;
  }
};
