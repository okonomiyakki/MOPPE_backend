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
    throw new AppError(500, '[ DB 에러 ] 북마크 등록 실패');
  }
};

/* 북마크 삭제 */
export const deleteBookmarkById = async (user_id: number, project_id: number): Promise<boolean> => {
  try {
    const SQL = `
    DELETE FROM bookmark
    WHERE project_id = ? AND user_id = ?
    `;

    const [result, _] = await db.execute(SQL, [project_id, user_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;

    if (!isAffected) throw new AppError(403, '[ DB 에러 ] 이미 삭제된 북마크 입니다.');

    return true;
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
    throw new AppError(500, '[ DB 에러 ] 회원 북마크 모집글 리스트 조회 실패');
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
    throw new AppError(500, '[ DB 에러 ] 모집글 별 북마크한 회원 정보 조회 실패');
  }
};
