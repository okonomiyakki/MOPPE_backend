import { AppError } from '../middlewares/errorHandler';
import * as bookmarkRepo from '../database/repository/bookmarkRepo';
import * as Bookmark from '../types/BookmarkType';
import { findProjectById } from '../database/repository/projectRepo';

/* 북마크 등록 */
export const addBookmark = async (inputData: Bookmark.CreateInput): Promise<any> => {
  try {
    await bookmarkRepo.findProjectById(inputData.project_id);

    const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(
      inputData.user_id
    );

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const isBookmarked = bookmarkedProjectIds.includes(inputData.project_id) ? true : false;

    if (isBookmarked) throw new AppError(500, '이미 북마크된 모집 글 입니다.');

    const createdBookmarkId: Bookmark.Id = await bookmarkRepo.createBookmark(inputData);

    return createdBookmarkId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 북마크 삭제 */
export const removeBookmark = async (user_id: number, project_id: number): Promise<boolean> => {
  try {
    await bookmarkRepo.findProjectById(project_id);

    const isDeletedBookmark = await bookmarkRepo.deleteBookmarkById(user_id, project_id);

    return isDeletedBookmark;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
