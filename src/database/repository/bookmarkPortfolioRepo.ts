import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as BookmarkPortfolio from '../../types/BookmarkPortfolioType';

/* 포트폴리오 북마크 등록 */
export const createBookmark = async (inputData: BookmarkPortfolio.CreateInput): Promise<any> => {
  try {
    const createColumns = `
    user_id,
    portfolio_id
    `;

    const createValues = Object.values(inputData);

    const SQL = `
    INSERT INTO
    portfolio_bookmark (${createColumns})
    VALUES (?, ?)
    `;

    const [result, _] = await db.execute(SQL, createValues);

    const createdBookmarkId: BookmarkPortfolio.Id = (result as { insertId: number }).insertId;

    return createdBookmarkId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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
