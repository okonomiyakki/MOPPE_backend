import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';
import * as Comment from '../../types/commentType';

/* 댓글 등록 */
export const createComment = async (inputData: Comment.CreateCommentInput): Promise<Comment.Id> => {
  try {
    const createColumn = `
    user_id,
    project_id,
    comment_content
    `;

    const createValues = Object.values(inputData);
    // const createValues = Object.values(inputData)
    //   .map((value) => {
    //     if (value === null || undefined) return 'DEFAULT';
    //     else if (typeof value === 'object') return `'${JSON.stringify(value)}'`;
    //     else return `'${value}'`;
    //   })
    //   .join(', ');

    const SQL = `
    INSERT INTO
    comment (${createColumn}) 
    VALUES (?, ?, ?)
    `;

    const [createdInfo, _] = await db.execute(SQL, createValues);

    const createdCommentId: Comment.Id = (createdInfo as { insertId: number }).insertId;

    return createdCommentId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 댓글 등록 실패');
  }
};

/* 댓글 수정 */
export const updateComment = async (
  comment_id: number,
  inputData: Comment.UpdateCommentInput
): Promise<number> => {
  try {
    const updateColums = Object.entries(inputData)
      .map(([key, _]) => `${key} = ?`)
      .join(', ');

    const updateValues = Object.values(inputData);
    // const updateColums = Object.entries(inputData)
    //   .filter(([_, value]) => value !== undefined)
    //   .map(([key, value]) => `${key}='${value}'`)
    //   .join(', ');

    const SQL = `
      UPDATE comment
      SET ${updateColums}
      WHERE comment_id = ?
    `;

    await db.execute(SQL, [...updateValues, comment_id]);

    return comment_id;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 댓글 수정 실패');
  }
};

/* 댓글 삭제 */
export const deleteCommentById = async (comment_id: number): Promise<boolean> => {
  try {
    const SQL = `
    DELETE FROM comment
    WHERE comment_id = ?
    `;

    await db.execute(SQL, [comment_id]);

    return true;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 댓글 삭제 실패');
  }
};

/* 댓글 조회 */
export const findCommentById = async (comment_id: number): Promise<any> => {
  try {
    const SQL = `
    SELECT *
    FROM comment
    WHERE comment_id = ?
    `;

    const [comments]: any = await db.query(SQL, [comment_id]);

    return comments;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 댓글 조회 실패');
  }
};

/* 모집 글 별 댓글 목록 조회 */
export const findProjectCommentsById = async (project_id: number): Promise<any> => {
  try {
    const selectColumns = `
    comment.comment_id,
    user.user_id,
    user.user_name,
    user.user_img,
    comment.comment_content,
    comment.comment_created_at
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM comment
    LEFT JOIN user ON user.user_id = comment.user_id
    WHERE comment.project_id = ?
    `;

    const [comments]: any = await db.query(SQL, [project_id]);

    return comments;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 모집 글 별 댓글 목록 조회 실패');
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

    const [comments]: any = await db.query(SQL, [user_id]);

    return comments;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 마이페이지 회원 별 작성 댓글 목록 조회 실패');
  }
};
