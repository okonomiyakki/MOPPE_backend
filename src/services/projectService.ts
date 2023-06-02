import { AppError } from '../utils/errorHandler';
import { CreateProjectInput } from '../types/ProjectType';
import * as P from '../types/ProjectType';
import * as B from '../types/BookmarkType';
import * as projectRepo from '../database/repository/projectRepo';
import * as bookmarkRepo from '../database/repository/bookmarkRepo';

/* 모집글 등록 */
export const addProject = async (inputData: CreateProjectInput): Promise<P.Id> => {
  try {
    const createdProjectId: P.Id = await projectRepo.createProject(inputData);

    // 같은 아이디로 연속적인 게시글 등록 요청 에러 반환 추가하기

    return createdProjectId;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 모집글 등록 실패');
    }
  }
};

/* 전체 모집글 목록 조회 */
export const getAllProjects = async (user_id: number): Promise<any> => {
  try {
    const foundProjects = await projectRepo.findAllProjects();

    const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(user_id);

    // 게시글 목록이 존재하는지 확인 후 없으면 에러 처리

    const BookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const projects: any = foundProjects.map((project: any) => {
      if (BookmarkedProjectIds.includes(project.project_id))
        return { ...project, is_bookmarked: true };
      else return { ...project, is_bookmarked: false };
    });

    return projects;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 전체 모집글 목록 조회 실패');
    }
  }
};

/* 역할별 모집글 목록 조회 - 로그인 유저가 북마크한 정보도 불러오기 */
export const getProjectsByRole = async (user_id: number, project_role: string): Promise<any> => {
  try {
    const foundProjects = await projectRepo.findProjectsByRole(project_role);

    const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(user_id);

    // 게시글 목록이 존재하는지 확인 후 없으면 에러 처리

    const BookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const projectsByRole: any = foundProjects.map((project: any) => {
      if (BookmarkedProjectIds.includes(project.project_id))
        return { ...project, is_bookmarked: true };
      else return { ...project, is_bookmarked: false };
    });

    return projectsByRole;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 역할별 모집글 목록 조회 실패');
    }
  }
};

/* 모집글 상세 정보 조회 */
export const getProjectById = async (user_id: number, project_id: number): Promise<any> => {
  try {
    const foundProject = await projectRepo.findProjectById(project_id);

    const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(user_id);

    // 게시글이 존재하는지 확인 후 없으면 에러 처리

    const BookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const projectInfo = BookmarkedProjectIds.includes(project_id)
      ? { ...foundProject, is_bookmarked: true }
      : { ...foundProject, is_bookmarked: false };

    return projectInfo;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 모집글 상세 정보 조회 실패');
    }
  }
};
