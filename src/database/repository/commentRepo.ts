import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';

/* 마이페이지 회원 별 작성 댓글 목록 조회 */
export const findMyCommentsById = async (user_id: number): Promise<any> => {
  try {
    const selectColumns = `
    comment.comment_id,
    project.project_id,
    project.project_title,
    project.project_type,
    comment.comment_content,
    comment.comment_created_at
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM comment
    LEFT JOIN user ON user.user_id = comment.user_id
    LEFT JOIN project ON project.project_id = comment.project_id
    WHERE comment.user_id = ?
    `;

    const [projects]: any = await db.query(SQL, [user_id]);

    return projects;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 마이페이지 회원 별 작성 댓글 목록 조회 실패');
  }
};
