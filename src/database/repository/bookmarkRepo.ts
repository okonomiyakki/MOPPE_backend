import db from '../../config/dbconfig';
import { AppError } from '../../utils/errorHandler';
import { UserBookmarkedProjects } from '../types/BookmarkType';

/* 회원이 북마크한 project_id 리스트 조회 */
export const findBookmarkedProjectsById = async (
  user_id: number
): Promise<UserBookmarkedProjects> => {
  try {
    const selectColum = 'project_id';

    const SQL = `
    SELECT ${selectColum}
    FROM bookmark
    WHERE bookmark.user_id = ?
    `;

    const [bookmarks]: any = await db.query(SQL, [user_id]);

    return bookmarks[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 북마크 모집글 리스트 조회 실패');
  }
};
