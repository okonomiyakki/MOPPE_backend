import * as projectRepo from '../database/repository/projectRepo';
import * as bookmarkProjectRepo from '../database/repository/bookmarkProjectRepo';
import * as Project from '../types/ProjectType';
import * as BookmarkProject from '../types/BookmarkProjectType';
import { paginateList } from '../utils/paginator';
import { generateNewDate } from '../utils/dateGenerator';
import { searchProjectsByQuery } from '../utils/searchProjects';

/* 모집 글 등록 */
export const addProject = async (inputData: Project.CreateInput): Promise<Project.Id> => {
  try {
    const createdProjectId: Project.Id = await projectRepo.createProject(inputData);

    return createdProjectId;
  } catch (error) {
    throw error;
  }
};

/* 모집 글 상세 정보 수정 */
export const editProjectInfo = async (
  user_id: number,
  project_id: number,
  inputData: Project.UpdateInput
): Promise<any> => {
  try {
    const updatedProjectId = await projectRepo.updateProjectInfo(user_id, project_id, inputData);

    return updatedProjectId;
  } catch (error) {
    throw error;
  }
};

/* 모집 글 모집 상태 수정 */
export const editProjectStatus = async (
  user_id: number,
  project_id: number,
  project_recruitment_status: string
): Promise<any> => {
  try {
    const updatedProjectId = await projectRepo.updateProjectStatus(
      user_id,
      project_id,
      project_recruitment_status
    );

    return updatedProjectId;
  } catch (error) {
    throw error;
  }
};

/* 모집 글 삭제 */
export const removeProject = async (user_id: number, project_id: number): Promise<boolean> => {
  try {
    const isDeletedProject = await projectRepo.deleteProjectById(user_id, project_id);

    return isDeletedProject;
  } catch (error) {
    throw error;
  }
};

/* 전체 모집 글 목록 조회 */
export const getAllProjects = async (
  user_id: number,
  inputQuery: Project.QueryInput
): Promise<any> => {
  try {
    const foundProjects = await searchProjectsByQuery(inputQuery); // TODO] 테스트 후 조건문 간소화 해야함

    const foundBookmarkedProjects = await bookmarkProjectRepo.findBookmarkedProjectsById(user_id);

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const checkIsBookmarked: any = foundProjects.map((project: any) => {
      if (bookmarkedProjectIds.includes(project.project_id))
        return { ...project, is_bookmarked: true };
      else return { ...project, is_bookmarked: false };
    });

    const pagenatedRowsInfo = paginateList(checkIsBookmarked, inputQuery.page, 10, true);

    const pagenatedProjectsInfo = {
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedProjects: pagenatedRowsInfo.pageRows,
    };

    return pagenatedProjectsInfo;
  } catch (error) {
    throw error;
  }
};

/* 역할 별 모집 글 목록 조회 - 로그인 유저가 북마크한 정보도 불러오기 */
export const getProjectsByRole = async (user_id: number, project_role: string): Promise<any> => {
  try {
    const foundProjects = await projectRepo.findProjectsByRole(project_role);

    const foundBookmarkedProjects = await bookmarkProjectRepo.findBookmarkedProjectsById(user_id);

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const projectsByRole: any = foundProjects.map((project: any) => {
      if (bookmarkedProjectIds.includes(project.project_id))
        return { ...project, is_bookmarked: true };
      else return { ...project, is_bookmarked: false };
    });

    return projectsByRole;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 모집 글 상세 정보 조회 */
export const getProjectById = async (user_id: number, project_id: number): Promise<any> => {
  try {
    const foundProject = await projectRepo.findProjectById(project_id);

    const foundBookmarkedUsers = await bookmarkProjectRepo.findBookmarkedUsersById(project_id);

    const foundBookmarkedProjects = await bookmarkProjectRepo.findBookmarkedProjectsById(user_id);

    const currentKorDate = generateNewDate();

    const isUserEnteredCurrentDate = await projectRepo.findUserViewDateById(
      user_id,
      project_id,
      currentKorDate
    );

    if (!isUserEnteredCurrentDate) {
      await projectRepo.updateProjectViewsCount(user_id, project_id, currentKorDate);
    }

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const checkIsBookmarked = bookmarkedProjectIds.includes(project_id)
      ? { ...foundProject, project_bookmark_users: foundBookmarkedUsers, is_bookmarked: true }
      : { ...foundProject, project_bookmark_users: foundBookmarkedUsers, is_bookmarked: false };

    return checkIsBookmarked;
  } catch (error) {
    throw error;
  }
};

/* 마이페이지 작성 모집 글 목록 조회 */
export const getMyProjectsById = async (
  my_user_id: number,
  user_id: number,
  page: number
): Promise<any> => {
  try {
    const foundMyProjects = await projectRepo.findMyProjectsById(user_id);

    const foundBookmarkedProjects = await bookmarkProjectRepo.findBookmarkedProjectsById(
      my_user_id
    );

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const checkIsBookmarked: any = foundMyProjects.map((project: any) => {
      if (bookmarkedProjectIds.includes(project.project_id))
        return { ...project, is_bookmarked: true };
      else return { ...project, is_bookmarked: false };
    });

    const pagenatedRowsInfo = paginateList(checkIsBookmarked, page, 5, true);

    const pagenatedProjectsInfo = {
      listLength: checkIsBookmarked.length,
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedProjects: pagenatedRowsInfo.pageRows,
    };

    return pagenatedProjectsInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 마이페이지 북마크 모집 글 목록 조회 */
export const getMyBookmarkedProjectsById = async (user_id: number, page: number): Promise<any> => {
  try {
    const foundMyBookmarkedProjects = await projectRepo.findMyBookmarkedProjectsById(user_id);

    const addIsBookmarked = foundMyBookmarkedProjects.map((project: any) => {
      return { ...project, is_bookmarked: true };
    });

    const pagenatedRowsInfo = paginateList(addIsBookmarked, page, 5, true);

    const pagenatedProjectsInfo = {
      listLength: addIsBookmarked.length,
      pageSize: pagenatedRowsInfo.pageSize,
      pagenatedProjects: pagenatedRowsInfo.pageRows,
    };

    return pagenatedProjectsInfo;
  } catch (error) {
    throw error;
  }
};
