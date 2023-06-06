import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';
import * as Bookmark from '../../types/BookmarkType';

/* 북마크 등록 */
export const createBookmark = async (inputData: Bookmark.CreateInput): Promise<any> => {
  try {
    const createColumns = `
      user_id,
      project_id
      `;

    const createValues = Object.values(inputData);

    const SQL = `
    INSERT INTO
    bookmark (${createColumns})
    VALUES (?, ?)
    `;

    const [result, _] = await db.execute(SQL, createValues);

    const createdBookmarkId: Bookmark.Id = (result as { insertId: number }).insertId;

    return createdBookmarkId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '북마크 등록 중 오류가 발생했습니다.');
  }
};

/* 북마크 삭제 */
export const deleteBookmarkById = async (user_id: number, project_id: number): Promise<boolean> => {
  try {
    const SQL = `
    DELETE FROM bookmark
    WHERE user_id = ? AND project_id = ?
    `;

    const [result, _] = await db.execute(SQL, [user_id, project_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;

    if (!isAffected) throw new AppError(403, '잘못된 접근입니다. 본인이 등록한 북마크가 아닙니다.');

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 북마크에 해당하는 모집 글 유효성 검사 */
export const findProjectById = async (project_id: number): Promise<void> => {
  try {
    const SQL = `
    SELECT *
    FROM project
    WHERE project_id = ?
    `;

    const [project]: any = await db.query(SQL, [project_id]);

    const isProjectValid = project[0];

    if (!isProjectValid) throw new AppError(404, '해당 모집 글은 이미 삭제 되었습니다.');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 회원이 북마크한 project_id 리스트 조회 */
export const findBookmarkedProjectsById = async (
  user_id: number
): Promise<Bookmark.BookmarkedProjects[]> => {
  try {
    const selectColumn = 'project_id';

    const SQL = `
    SELECT ${selectColumn}
    FROM bookmark
    WHERE bookmark.user_id = ?
    `;

    const [bookmarks]: any = await db.query(SQL, [user_id]);

    return bookmarks;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '북마크한 모집 글 조회 중 오류가 발생했습니다.');
  }
};

/* 모집글 별 북마크한 회원 정보 조회 */
export const findBookmarkedUsersById = async (project_id: number): Promise<any> => {
  try {
    const selectColumns = `user.user_id, user.user_name, user.user_img`;

    const SQL = `
    SELECT ${selectColumns}
    FROM bookmark
    INNER JOIN user ON bookmark.user_id = user.user_id
    WHERE bookmark.project_id = ?
    `;

    const [bookmarks]: any = await db.query(SQL, [project_id]);

    return bookmarks;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '북마크한 회원 정보 조회 중 오류가 발생했습니다.');
  }
};
