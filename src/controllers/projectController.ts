import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { AuthRequest } from '../types/RequestType';
import * as P from '../types/ProjectType';
import * as projectService from '../services/projectService';

/* 모집 글 등록 */
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

    for (const field of reqBodyFields) {
      if (!req.body[field]) throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');
    }

    const inputData: P.CreateProjectInput = {
      user_id,
      ...req.body,
    };

    const createdProjectId: P.Id = await projectService.addProject(inputData);

    res.status(201).json({ message: '모집 글 등록 성공', data: { project_id: createdProjectId } });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error); // 서비스 에러 404 추가
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 모집 글 등록 실패'));
    }
  }
};

/* 전체 모집 글 목록 조회 */
export const getAllProjectsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;

    console.log('user_id: ', user_id);

    const foundProjects = await projectService.getAllProjects(user_id);

    res.status(200).json({ message: '전체 모집 글 목록 조회 성공', data: foundProjects });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 전체 모집 글 목록 조회 실패'));
    }
  }
};

/* 역할 별 모집 글 목록 조회 */
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

    res.status(200).json({ message: '역할별 모집 글 목록 조회 성공', data: foundProjectsByRole });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 역할 별 모집 글 목록 조회 실패'));
    }
  }
};

/* 모집 글 상세 정보 조회 */
export const getProjectByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { project_id } = req.params;
    const { user_id } = req.user;

    console.log('user_id: ', user_id);

    if (!project_id) throw new AppError(400, 'project_id를 입력해주세요.');

    if (isNaN(Number(project_id))) throw new AppError(400, '유효한 project_id를 입력해주세요.');

    const foundProjectInfo = await projectService.getProjectById(user_id, Number(project_id));

    res.status(200).json({ message: '모집 글 상세 정보 조회 성공', data: foundProjectInfo });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 모집 글 상세 정보 조회 실패'));
    }
  }
};

/* 마이페이지 회원 별 작성 모집 글 목록 조회 */
export const getMyProjectsByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.user_id === 0)
      throw new AppError(403, '잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;

    const foundMyProjects = await projectService.getMyProjectsById(user_id);

    res.status(200).json({
      message: '마이페이지 회원 별 작성 모집 글 목록 조회 성공',
      data: { user_projects: [...foundMyProjects] },
    });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 마이페이지 회원 별 작성 모집 글 목록 조회 실패'));
    }
  }
};

/* 마이페이지 회원 별 북마크 모집 글 목록 조회 */
export const getMyBookmarkedProjectsByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.user_id === 0)
      throw new AppError(403, '잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;

    const foundMyProjects = await projectService.getMyBookmarkedProjectsById(user_id);

    res.status(200).json({
      message: '마이페이지 회원 별 북마크 모집 글 목록 조회 성공',
      data: { user_projects: [...foundMyProjects] },
    });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(
        new AppError(500, '[ HTTP 요청 에러 ] 마이페이지 회원 별 북마크 모집 글 목록 조회 실패')
      );
    }
  }
};
