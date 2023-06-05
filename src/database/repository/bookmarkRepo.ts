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
