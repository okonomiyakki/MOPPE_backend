import * as AppErrors from '../middlewares/errorHandler';
import * as projectRepo from '../database/repository/projectRepo';
import * as Project from '../types/ProjectType';

export const searchProjectsByQuery = async (inputQuery: Project.QueryInput) => {
  try {
    // 전체 조회
    if (!inputQuery.project_role && !inputQuery.project_keyword) {
      // 전체 모집 중
      if (inputQuery.project_status === 'RECRUITING') {
        const foundProjects = await projectRepo.findProjectsByStatus(inputQuery.project_status);
        return foundProjects;
      }
      // 전체 모집 완료
      else if (inputQuery.project_status === 'COMPLETE') {
        const foundProjects = await projectRepo.findProjectsByStatus(inputQuery.project_status);
        return foundProjects;
      }
      // 전체
      else {
        const foundProjects = await projectRepo.findAllProjects();
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
        return foundProjects;
      }
      // 역할 별 모집 완료
      else if (inputQuery.project_status === 'COMPLETE') {
        const foundProjects = await projectRepo.findProjectsByRoleWithStatus(
          inputQuery.project_role,
          inputQuery.project_status
        );
        return foundProjects;
      }
      // 역할 별 전체
      else {
        const foundProjects = await projectRepo.findProjectsByRole(inputQuery.project_role);
        return foundProjects;
      }
    }
    // 키워드 별 조회
    else if (!inputQuery.project_role && inputQuery.project_keyword) {
      // 키워드 별 모집 중
      if (inputQuery.project_status === 'RECRUITING') {
        const foundProjects = await projectRepo.findProjectsByKeywordWithStatus(
          inputQuery.project_keyword,
          inputQuery.project_status
        );
        return foundProjects;
      }
      // 키워드 별 모집 완료
      else if (inputQuery.project_status === 'COMPLETE') {
        const foundProjects = await projectRepo.findProjectsByKeywordWithStatus(
          inputQuery.project_keyword,
          inputQuery.project_status
        );
        return foundProjects;
      }
      // 키워드 별 전체
      else {
        const foundProjects = await projectRepo.findProjectsByKeyword(inputQuery.project_keyword);
        return foundProjects;
      }
    } else throw AppErrors.handleBadRequest('키워드와 모집 역할은 동시에 선택하실 수 없습니다.');
  } catch (error) {
    throw error;
  }
};
