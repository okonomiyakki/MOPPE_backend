import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as CommentPortfolio from '../../types/CommentPortfolioType';

/* 포트폴리오 댓글 등록 */
export const createComment = async (
  inputData: CommentPortfolio.CreateInput
): Promise<CommentPortfolio.Id> => {
  try {
    const createColumn = `
    user_id,
    portfolio_id,
    comment_content
    `;

    const createValues = Object.values(inputData);

    const SQL = `
    INSERT INTO
    portfolio_comment (${createColumn}) 
    VALUES (?, ?, ?)
    `;

    const [createdInfo, _] = await db.execute(SQL, createValues);

    const createdCommentId: CommentPortfolio.Id = (createdInfo as { insertId: number }).insertId;

    return createdCommentId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
