import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as CommentProject from '../../types/CommentProjectType';

/* 댓글 등록 */
export const createComment = async (
  inputData: CommentProject.CreateCommentInput
): Promise<CommentProject.Id> => {
  try {
    const createColumn = `
    user_id,
    project_id,
    comment_content,
    parent_id
    `;

    const createValues = Object.values(inputData);

    const SQL = `
    INSERT INTO
    comment (${createColumn})
    VALUES (?, ?, ?, ?)
    `;

    const [createdInfo, _] = await db.execute(SQL, createValues);

    const createdCommentId: CommentProject.Id = (createdInfo as { insertId: number }).insertId;

    return createdCommentId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 댓글 수정 */
export const updateComment = async (
  user_id: number,
  comment_id: number,
  inputData: CommentProject.UpdateCommentInput
): Promise<number> => {
  try {
    const updateColums = Object.entries(inputData)
      .map(([key, _]) => `${key} = ?`)
      .join(', ');

    const updateValues = Object.values(inputData);

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
      throw AppErrors.handleForbidden('본인만 수정 가능 합니다.');

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

    if (!isAffected) throw AppErrors.handleForbidden('본인만 삭제 가능 합니다.');

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 댓글 수정, 삭제 시 모집 글 유효성 검사 */
export const isProjectValid = async (comment_id: number): Promise<void> => {
  try {
    const SQL = `
    SELECT *
    FROM comment
    JOIN project ON project.project_id = comment.project_id
    WHERE comment_id = ?
    `;

    const [comment]: any = await db.query(SQL, [comment_id]);

    const isProjectValid = comment[0].project_id;

    if (!isProjectValid) throw AppErrors.handleNotFound('이미 삭제된 모집 글 입니다.');
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

    return comments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 마이페이지 작성 댓글 목록 조회 */
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
    throw error;
  }
};
