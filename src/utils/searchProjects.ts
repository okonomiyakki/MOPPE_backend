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
    } else AppErrors.handleBadRequest('키워드와 모집 역할은 동시에 선택하실 수 없습니다.');
  } catch (error) {
    throw error;
  }
};
