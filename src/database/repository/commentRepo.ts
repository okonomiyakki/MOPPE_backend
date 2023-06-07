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
    throw new AppError(500, '댓글 등록 중 오류가 발생했습니다.');
  }
};

/* 댓글 수정 */
export const updateComment = async (
  user_id: number,
  comment_id: number,
  inputData: Comment.UpdateCommentInput
): Promise<number> => {
  try {
    const updateColums = Object.entries(inputData)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = ?`)
      .join(', ');

    const updateValues = Object.values(inputData).filter((value) => value !== undefined);

    const SQL = `
      UPDATE comment
      SET ${updateColums}
      WHERE user_id = ? AND comment_id = ?
    `;

    const [result, _] = await db.execute(SQL, [...updateValues, user_id, comment_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;
    const isMatched = Number((result as { info: string }).info.split(' ')[2]) === 1 ? true : false;
    const isChanged = Number((result as { info: string }).info.split(' ')[5]) === 1 ? true : false;

    if (!isAffected && !isMatched && !isChanged)
      throw new AppError(403, '해당 댓글 작성자만 수정할 수 있습니다.');

    return comment_id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 댓글 삭제 */
export const deleteCommentById = async (user_id: number, comment_id: number): Promise<boolean> => {
  try {
    const SQL = `
    DELETE FROM comment
    WHERE user_id = ? AND comment_id = ?
    `;

    const [result, _] = await db.execute(SQL, [user_id, comment_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;

    if (!isAffected) throw new AppError(403, '해당 댓글 작성자만 삭제할 수 있습니다.');

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 댓글에 해당하는 모집 글 유효성 검사 */
export const findProjectById = async (comment_id: number): Promise<void> => {
  try {
    const SQL = `
    SELECT *
    FROM comment
    JOIN project ON project.project_id = comment.project_id
    WHERE comment_id = ?
    `;

    const [comment]: any = await db.query(SQL, [comment_id]);

    const isProjectValid = comment[0];

    if (!isProjectValid) throw new AppError(404, '해당 모집 글은 이미 삭제 되었습니다.');
  } catch (error) {
    console.log(error);
    throw error;
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

    if (!comments.length) throw new AppError(404, '존재하는 댓글이 없습니다.');

    return comments;
  } catch (error) {
    console.log(error);
    throw error;
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

    if (!comments.length) throw new AppError(404, '존재하는 댓글이 없습니다.');

    return comments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
