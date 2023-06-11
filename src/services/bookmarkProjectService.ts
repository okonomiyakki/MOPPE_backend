import * as AppErrors from '../middlewares/errorHandler';
import * as bookmarkProjectRepo from '../database/repository/bookmarkProjectRepo';
import * as projectRepo from '../database/repository/projectRepo';
import * as BookmarkProject from '../types/BookmarkProjectType';

/* 북마크 등록 */
export const addBookmark = async (inputData: BookmarkProject.CreateInput): Promise<any> => {
  try {
    await projectRepo.isProjectValid(inputData.project_id);

    const foundBookmarkedProjects = await bookmarkProjectRepo.findBookmarkedProjectsById(
      inputData.user_id
    );

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const isBookmarked = bookmarkedProjectIds.includes(inputData.project_id) ? true : false;

    if (isBookmarked) throw AppErrors.handleBadRequest('이미 북마크된 모집 글 입니다.');

    const createdBookmarkId: BookmarkProject.Id = await bookmarkProjectRepo.createBookmark(
      inputData
    );

    return createdBookmarkId;
  } catch (error) {
    throw error;
  }
};

/* 북마크 삭제 */
export const removeBookmark = async (user_id: number, project_id: number): Promise<boolean> => {
  try {
    await projectRepo.isProjectValid(project_id);

    const isDeletedBookmark = await bookmarkProjectRepo.deleteBookmarkById(user_id, project_id);

    return isDeletedBookmark;
  } catch (error) {
    throw error;
  }
};
