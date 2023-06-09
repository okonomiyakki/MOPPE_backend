import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as BookmarkPortfolioT from '../../types/BookmarkProjectType';

/* 회원이 북마크한 portfolio_id 리스트 조회 */
export const findBookmarkedPortfolioById = async (user_id: number): Promise<any> => {
  try {
    const selectColumn = 'portfolio_id';

    const SQL = `
    SELECT ${selectColumn}
    FROM portfolio_bookmark
    WHERE portfolio_bookmark.user_id = ?
    `;

    const [portfolios]: any = await db.query(SQL, [user_id]);

    return portfolios;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
