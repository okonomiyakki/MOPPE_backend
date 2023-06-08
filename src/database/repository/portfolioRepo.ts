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
