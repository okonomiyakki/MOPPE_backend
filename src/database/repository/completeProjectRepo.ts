import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as CompleteProject from '../../types/CompleteProjectType';

/* 모집 완료 프로젝트 포트폴리오에 등록 */
export const createCompletedProject = async (
  project_id: number,
  portfolio_id: number
): Promise<CompleteProject.Id> => {
  try {
    const createColumn = `
    project_id,
    portfolio_id
    `;

    const SQL = `
    INSERT INTO
    project_complete (${createColumn}) 
    VALUES (?, ?)
    `;

    const [createdInfo, _] = await db.execute(SQL, [project_id, portfolio_id]);

    const createdProjectId: CompleteProject.Id = (createdInfo as { insertId: number }).insertId;

    return createdProjectId;
  } catch (error) {
    console.log(error);
    throw AppErrors.handleBadRequest('이미 등록된 모집 글입니다.');
  }
};

/* 포트폴리오로 등록된 모집 글 수정 */
export const deleteCompletedProject = async (portfolio_id: number): Promise<void> => {
  try {
    const SQL = `
    DELETE FROM project_complete
    WHERE portfolio_id = ?
    `;

    await db.execute(SQL, [portfolio_id]);
  } catch (error) {
    console.log(error);
    throw AppErrors.handleBadRequest('이미 등록된 모집 글입니다.');
  }
};

/* 모집 글 관련 포트폴리오 조회 */
export const findPortfolioByCompletedProjectId = async (project_id: number): Promise<any> => {
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
    FROM project_complete
    INNER JOIN portfolio ON portfolio.portfolio_id = project_complete.portfolio_id
    LEFT JOIN portfolio_bookmark ON portfolio_bookmark.portfolio_id = portfolio.portfolio_id
    LEFT JOIN portfolio_comment ON portfolio_comment.portfolio_id = portfolio.portfolio_id
    WHERE project_complete.project_id = ?
    `;

    const [portfolio]: any = await db.query(SQL, [project_id]);

    if (!portfolio[0].portfolio_id) return [];
    else return portfolio;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
