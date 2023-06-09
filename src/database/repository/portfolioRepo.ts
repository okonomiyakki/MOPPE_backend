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
    console.log(error);
    throw error;
  }
};

/* 전체 포트폴리오 목록 조회 */
export const findAllPortfolios = async (): Promise<any> => {
  try {
    const selectColumns = `
    portfolio.portfolio_id,
    portfolio.portfolio_title,
    portfolio.portfolio_summary,
    portfolio.portfolio_thumbnail,
    portfolio.portfolio_stacks,
    COUNT(DISTINCT portfolio_bookmark.user_id) AS portfolio_bookmark_count,
    COUNT(DISTINCT portfolio_comment.comment_id) AS portfolio_comments_count,
    portfolio.portfolio_views_count,
    portfolio.portfolio_created_at
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM portfolio
    LEFT JOIN portfolio_bookmark ON portfolio_bookmark.portfolio_id = portfolio.portfolio_id
    LEFT JOIN portfolio_comment ON portfolio_comment.portfolio_id = portfolio.portfolio_id
    GROUP BY portfolio.portfolio_id
    `;

    const [portfolios]: any = await db.query(SQL);

    return portfolios; // TODO] as portfolios.ListByRole[]; 명시적으로 타입 선언
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 키워드 별 포트폴리오 목록 조회 */
export const findPortfoliosByKeyword = async (portfolio_keyword: string): Promise<any> => {
  try {
    const selectColumns = `
    portfolio.portfolio_id,
    portfolio.portfolio_title,
    portfolio.portfolio_summary,
    portfolio.portfolio_thumbnail,
    portfolio.portfolio_stacks,
    COUNT(DISTINCT portfolio_bookmark.user_id) AS portfolio_bookmark_count,
    COUNT(DISTINCT portfolio_comment.comment_id) AS portfolio_comments_count,
    portfolio.portfolio_views_count,
    portfolio.portfolio_created_at
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM portfolio
    LEFT JOIN portfolio_bookmark ON portfolio_bookmark.portfolio_id = portfolio.portfolio_id
    LEFT JOIN portfolio_comment ON portfolio_comment.portfolio_id = portfolio.portfolio_id
    WHERE portfolio.portfolio_title LIKE CONCAT('%', ?, '%') 
    OR portfolio.portfolio_summary LIKE CONCAT('%', ?, '%') 
    OR portfolio.portfolio_description LIKE CONCAT('%', ?, '%')
    OR JSON_CONTAINS(portfolio.portfolio_stacks->'$.stackList', JSON_ARRAY(?))
    GROUP BY portfolio.portfolio_id
    `;

    const [portfolio]: any = await db.query(SQL, [
      portfolio_keyword,
      portfolio_keyword,
      portfolio_keyword,
      portfolio_keyword,
      portfolio_keyword,
    ]);

    return portfolio;
  } catch (error) {
    console.log(error);
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
    COUNT(DISTINCT portfolio_bookmark.user_id) AS portfolio_bookmark_count,
    COUNT(DISTINCT portfolio_comment.comment_id) AS portfolio_comments_count,
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
    console.log(error);
    throw error;
  }
};
