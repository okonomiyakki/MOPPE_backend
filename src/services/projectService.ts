import { AppError } from '../middlewares/errorHandler';
import * as projectRepo from '../database/repository/projectRepo';
import * as bookmarkRepo from '../database/repository/bookmarkRepo';
import * as Project from '../types/ProjectType';
import * as Bookmark from '../types/BookmarkType';
import { paginateList } from '../utils/paginator';

/* 모집 글 등록 */
export const addProject = async (inputData: Project.CreateProjectInput): Promise<Project.Id> => {
  try {
    const createdProjectId: Project.Id = await projectRepo.createProject(inputData);

    // 같은 아이디로 연속적인 모집 글 등록 요청 에러 반환 추가하기

    return createdProjectId;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 모집 글 등록 실패');
    }
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
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 모집 글 상세 정보 수정 실패');
    }
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
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 모집 글 모집 상태 수정 실패');
    }
  }
};

/* 모집 글 삭제 */
export const removeProject = async (user_id: number, project_id: number): Promise<boolean> => {
  try {
    const isDeletedProject = await projectRepo.deleteProjectById(user_id, project_id);

    return isDeletedProject;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 모집 글 삭제 실패');
    }
  }
};

const getProjectsByQuery = async (inputQuery: Project.QueryInput) => {
  try {
    // 전체 조회
    if (!inputQuery.project_role && !inputQuery.project_keyword) {
      // 전체 모집 중
      if (inputQuery.project_status === 'RECRUITING') {
        const foundProjects = await projectRepo.findProjectsByStatus(inputQuery.project_status);
        console.log(1);
        return foundProjects;
      }
      // 전체 모집 완료
      else if (inputQuery.project_status === 'COMPLETE') {
        const foundProjects = await projectRepo.findProjectsByStatus(inputQuery.project_status);
        console.log(2);
        return foundProjects;
      }
      // 전체
      else {
        const foundProjects = await projectRepo.findAllProjects();
        console.log(3);
        return foundProjects;
      }
    }
    // 역할 별 조회
    else if (inputQuery.project_role && !inputQuery.project_keyword) {
      // 역할 별 모집 중
      if (inputQuery.project_status === 'RECRUITING') {
        const foundProjects = await projectRepo.findProjectsByRoleWithStatus(
          inputQuery.project_role,
          inputQuery.project_status
        );
        console.log(4);
        return foundProjects;
      }
      // 역할 별 모집 완료
      else if (inputQuery.project_status === 'COMPLETE') {
        const foundProjects = await projectRepo.findProjectsByRoleWithStatus(
          inputQuery.project_role,
          inputQuery.project_status
        );
        console.log(5);
        return foundProjects;
      }
      // 역할 별 전체
      else {
        const foundProjects = await projectRepo.findProjectsByRole(inputQuery.project_role);
        console.log(6);
        return foundProjects;
      }
    }
    // 키워드 별 조회
    else if (!inputQuery.project_role && inputQuery.project_keyword) {
      // 키워드 별 모집 중
      if (inputQuery.project_status === 'RECRUITING') {
        console.log(inputQuery.project_keyword);
        const foundProjects = await projectRepo.findProjectsByKeywordWithStatus(
          inputQuery.project_keyword,
          inputQuery.project_status
        );
        console.log(7);
        return foundProjects;
      }
      // 키워드 별 모집 완료
      else if (inputQuery.project_status === 'COMPLETE') {
        const foundProjects = await projectRepo.findProjectsByKeywordWithStatus(
          inputQuery.project_keyword,
          inputQuery.project_status
        );
        console.log(8);
        return foundProjects;
      }
      // 키워드 별 전체
      else {
        const foundProjects = await projectRepo.findProjectsByKeyword(inputQuery.project_keyword);
        console.log(9);
        return foundProjects;
      }
    } else throw new AppError(500, '키워드와 모집 역할은 동시에 선택하실 수 없습니다.');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 전체 모집 글 목록 조회 */
export const getAllProjects = async (
  user_id: number,
  inputQuery: Project.QueryInput
): Promise<any> => {
  try {
    // TODO] 모집 글 목록이 존재하는지 확인 후 없으면 에러 처리

    const foundProjects = await getProjectsByQuery(inputQuery); // TODO] 테스트 후 조건문 간소화 해야함

    const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(user_id);

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const allprojects: any = foundProjects.map((project: any) => {
      if (bookmarkedProjectIds.includes(project.project_id))
        return { ...project, is_bookmarked: true };
      else return { ...project, is_bookmarked: false };
    });

    const pagenatedProjects = paginateList(allprojects, inputQuery.page);

    const pageSize = Math.ceil(allprojects.length / 10); // TODO] 유틸로 옮기기

    const pagenatedProjectsInfo = {
      pageSize,
      pagenatedProjects,
    };

    return pagenatedProjectsInfo;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw error;
    }
  }
};

/* 역할 별 모집 글 목록 조회 - 로그인 유저가 북마크한 정보도 불러오기 */
export const getProjectsByRole = async (user_id: number, project_role: string): Promise<any> => {
  try {
    const foundProjects = await projectRepo.findProjectsByRole(project_role);

    const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(user_id);

    // TODO] 모집 글 목록이 존재하는지 확인 후 없으면 에러 처리

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const projectsByRole: any = foundProjects.map((project: any) => {
      if (bookmarkedProjectIds.includes(project.project_id))
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
      throw new AppError(500, '[ 서버 에러 ] 역할 별 모집 글 목록 조회 실패');
    }
  }
};

/* 모집 글 상세 정보 조회 */
export const getProjectById = async (user_id: number, project_id: number): Promise<any> => {
  try {
    // TODO] 모집 글이 존재하는지 확인 후 없으면 에러 처리

    const foundProject = await projectRepo.findProjectById(project_id);

    const foundBookmarkedUsers = await bookmarkRepo.findBookmarkedUsersById(project_id);

    const foundBookmarkedProjects = await bookmarkRepo.findBookmarkedProjectsById(user_id);

    const currentDate = new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });

    const splitDate = currentDate.split('. ');

    const currentKorDate = `${splitDate[0]}-${splitDate[1]}-${splitDate[2]}`;

    const isUserEnteredCurrentDate = await projectRepo.findUserViewDateById(
      user_id,
      project_id,
      currentKorDate
    );

    if (!isUserEnteredCurrentDate) {
      await projectRepo.updateProjectViewsCount(user_id, project_id, currentKorDate);
    }

    const bookmarkedProjectIds = foundBookmarkedProjects.map((project) => project.project_id);

    const projectInfo = bookmarkedProjectIds.includes(project_id)
      ? { ...foundProject, project_bookmark_users: foundBookmarkedUsers, is_bookmarked: true }
      : { ...foundProject, project_bookmark_users: foundBookmarkedUsers, is_bookmarked: false };

    return projectInfo;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 모집 글 상세 정보 조회 실패');
    }
  }
};

/* 마이페이지 회원 별 작성 모집 글 목록 조회 */
export const getMyProjectsById = async (user_id: number, page: number): Promise<any> => {
  try {
    // TODO] 모집 글 목록이 존재하는지 확인 후 없으면 에러 처리
    const foundMyProjects = await projectRepo.findMyProjectsById(user_id);

    const pagenatedProjects = paginateList(foundMyProjects, page);

    const pageSize = Math.ceil(foundMyProjects.length / 10); // TODO] 유틸로 옮기기

    const pagenatedProjectsInfo = {
      pageSize,
      pagenatedProjects,
    };

    return pagenatedProjectsInfo;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 마이페이지 회원 별 작성 모집 글 목록 조회 실패');
    }
  }
};

/* 마이페이지 회원 별 북마크 모집 글 목록 조회 */
export const getMyBookmarkedProjectsById = async (user_id: number, page: number): Promise<any> => {
  try {
    // TODO] 모집 글 목록이 존재하는지 확인 후 없으면 에러 처리

    const foundMyBookmarkedProjects = await projectRepo.findMyBookmarkedProjectsById(user_id);

    const pagenatedProjects = paginateList(foundMyBookmarkedProjects, page);

    const pageSize = Math.ceil(foundMyBookmarkedProjects.length / 10); // TODO] 유틸로 옮기기

    const pagenatedProjectsInfo = {
      pageSize,
      pagenatedProjects,
    };

    return pagenatedProjectsInfo;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 마이페이지 회원 별 북마크 모집 글 목록 조회 실패');
    }
  }
};
