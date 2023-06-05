import { AppError } from '../middlewares/errorHandler';
import * as bookmarkRepo from '../database/repository/bookmarkRepo';
import * as Bookmark from '../types/BookmarkType';

/* 북마크 등록 */
export const addBookmark = async (inputData: Bookmark.CreateInput): Promise<any> => {
  try {
    const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(
      inputData.user_id
    );

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const isBookmarked = bookmarkedProjectIds.includes(inputData.project_id) ? true : false;

    if (isBookmarked) throw new AppError(500, '이미 북마크된 모집 글 입니다.');

    const createdBookmarkId: Bookmark.Id = await bookmarkRepo.createBookmark(inputData);

    return createdBookmarkId;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 북마크 등록 실패');
    }
  }
};
