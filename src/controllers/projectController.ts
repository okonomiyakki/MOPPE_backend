import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { AuthRequest } from '../database/types/RequestType';
import * as P from '../database/types/ProjectType';
import * as projectService from '../services/projectService';

/* 모집글 등록 */
export const addProjectHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;

    const reqBodyFields = [
      'project_type',
      'project_title',
      'project_summary',
      'project_recruitment_role',
      'project_required_stacks',
      'project_goal',
      'project_participation_time',
      'project_introduction',
    ];

    if (isNaN(Number(user_id)))
      throw new AppError(403, '정상적인 접근이 아닙니다. 로그인을 다시 해주세요.');

    for (const field of reqBodyFields) {
      if (!req.body[field]) throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');
    }

    const inputData: P.CreateProjectInput = {
      user_id,
      ...req.body,
    };

    const createdProjectId: P.Id = await projectService.addProject(inputData);

    res.status(201).json({ message: '모집글 등록 성공', data: { project_id: createdProjectId } });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 모집글 등록 실패'));
    }
  }
};

/* 전체 모집글 목록 조회 */
export const getAllProjectsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;

    console.log('user_id: ', user_id);

    const foundProjects = await projectService.getAllProjects(user_id);

    res.status(200).json({ message: '전체 모집글 목록 조회 성공', data: foundProjects });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 전체 모집글 목록 조회 실패'));
    }
  }
};

/* 역할별 모집글 목록 조회 */
export const getProjectsByRoleHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { project_role } = req.params;
    const { user_id } = req.user;

    console.log('user_id: ', user_id);

    if (!project_role) throw new AppError(400, 'project_role를 입력해주세요.');

    const foundProjectsByRole = await projectService.getProjectsByRole(user_id, project_role);

    res.status(200).json({ message: '역할별 모집글 목록 조회 성공', data: foundProjectsByRole });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 역할별 모집글 목록 조회 실패'));
    }
  }
};
