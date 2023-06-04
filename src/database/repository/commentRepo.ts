import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';
import * as C from '../../types/commentType';

/* 댓글 등록 */
export const createComment = async (inputData: C.CreateCommentInput): Promise<C.Id> => {
  try {
    const createColumn = `
    user_id,
    project_id,
    comment_content
    `;

    const createValues = Object.values(inputData)
      .map((value) => {
        if (value === null) return 'DEFAULT';
        else if (typeof value === 'object') return `'${JSON.stringify(value)}'`;
        else return `'${value}'`;
      })
      .join(', ');

    const SQL = `
    INSERT INTO
    comment (${createColumn}) 
    VALUES (${createValues})
    `;

    const [createdInfo, _] = await db.query(SQL);

    const createdCommentId: C.Id = (createdInfo as { insertId: number }).insertId;

    return createdCommentId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 댓글 등록 실패');
  }
};

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
