import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { AuthRequest } from '../database/types/RequestType';
import { CreateProjectInput } from '../database/types/ProjectType';
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
      throw new AppError(400, '정상적인 접근이 아닙니다. 로그인을 다시 해주세요.');

    for (const field of reqBodyFields) {
      if (!req.body[field]) throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');
    }

    const inputData: CreateProjectInput = {
      user_id,
      ...req.body,
    };

    const createdProjectId = await projectService.addProject(inputData);

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

/* 모집 역할별 모집글 목록 조회 */
export const getProjectsByRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { project_role } = req.params;
    // user_id 받기 post

    if (!project_role) throw new AppError(400, 'project_role를 입력해주세요.');

    const foundProjectsByRole = await projectService.getProjectsByRole(project_role);

    res
      .status(201)
      .json({ message: '모집 역할별 모집글 목록 성공', data: { project_id: foundProjectsByRole } });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 모집 역할별 모집글 목록 실패'));
    }
  }
};
