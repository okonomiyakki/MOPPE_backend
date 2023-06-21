import db from '../../config/dbconfig';

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

    return portfolio[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
