import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
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
    throw error;
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

    if (!isAffected) AppErrors.handleForbidden('본인만 삭제 가능 합니다.');

    return true;
  } catch (error) {
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
    throw error;
  }
};

/* 회원이 북마크한 portfolio_id 리스트 조회 */
export const findBookmarkedPortfolioById = async (user_id: number): Promise<any> => {
  try {
    const selectColumn = 'portfolio_id';

    const SQL = `
    SELECT ${selectColumn}
    FROM portfolio_bookmark
    WHERE portfolio_bookmark.user_id = ?
    `;

    const [portfolios]: any = await db.query(SQL, [user_id]);

    return portfolios;
  } catch (error) {
    throw error;
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
    throw error;
  }
};
