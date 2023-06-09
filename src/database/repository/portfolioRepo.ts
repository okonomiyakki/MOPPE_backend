import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as Portfolio from '../../types/PortfolioType';

/* 포트폴리오 등록 */
export const createPorfolio = async (inputData: Portfolio.CreateInput): Promise<Portfolio.Id> => {
  try {
    const createColumns = `
    user_id,
    portfolio_title, 
    portfolio_summary,
    portfolio_thumbnail,
    portfolio_github,
    portfolio_stacks,
    portfolio_description,
    portfolio_img
    `;

    const createValues = Object.values(inputData);

    const SQL = `
    INSERT INTO
    portfolio (${createColumns}) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result, _] = await db.execute(SQL, createValues);

    const createdPorfolioId = (result as { insertId: number }).insertId;

    return createdPorfolioId;
  } catch (error) {
    throw error;
  }
};

/* 포트폴리오 상세 정보 조회 */
export const findPortfolioById = async (portfolio_id: number): Promise<any> => {
  try {
    const selectColumns = `
    portfolio.portfolio_id,
    portfolio.portfolio_title,
    portfolio.portfolio_summary,
    portfolio.portfolio_thumbnail,
    portfolio.portfolio_github,
    portfolio.portfolio_stacks,
    portfolio.portfolio_description,
    portfolio.portfolio_img,
    COUNT(DISTINCT bookmark.user_id) AS portfolio_bookmark_count,
    COUNT(DISTINCT comment.comment_id) AS portfolio_comments_count,
    portfolio.portfolio_views_count,
    portfolio.portfolio_created_at,
    user.user_id,
    user.user_name,
    user.user_introduction,
    user.user_img
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM portfolio
    LEFT JOIN bookmark ON bookmark.portfolio_id = portfolio.portfolio_id
    LEFT JOIN comment ON comment.portfolio_id = portfolio.portfolio_id
    JOIN user ON user.user_id = portfolio.user_id
    WHERE portfolio.portfolio_id = ?
    `;

    const [portfolio]: any = await db.query(SQL, [portfolio_id]);

    const isPortfolioValid = portfolio[0];

    if (!isPortfolioValid) AppErrors.handleNotFound('이미 삭제된 포트폴리오 입니다.');

    return portfolio[0];
  } catch (error) {
    throw error;
  }
};
