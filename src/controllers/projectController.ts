import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import env from '../config/envconfig';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as projectService from '../services/projectService';
import * as Project from '../types/ProjectType';

/* 모집 글 등록 */
export const addProjectHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const createReqBody = req.body;

    createReqBody.project_recruitment_roles = {
      roleList: JSON.parse(createReqBody.project_recruitment_roles),
    };

    createReqBody.project_required_stacks = {
      stackList: JSON.parse(createReqBody.project_required_stacks),
    };

    createReqBody.project_img = {
      imgList: createReqBody.project_img,
    };

    const inputData: Project.CreateInput = { user_id, ...createReqBody };

    const createdProjectId: Project.Id = await projectService.addProject(inputData);

    res.status(201).json({ message: '모집 글 등록 성공', data: { project_id: createdProjectId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 모집 글 상세 정보 수정 */
export const editProjectInfoHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.params;
    const updateReqBody = req.body;

    updateReqBody.project_recruitment_roles = {
      roleList: JSON.parse(updateReqBody.project_recruitment_roles),
    };

    updateReqBody.project_required_stacks = {
      stackList: JSON.parse(updateReqBody.project_required_stacks),
    };

    if (updateReqBody.project_img.length === 0) delete updateReqBody.project_img;
    else
      updateReqBody.project_img = {
        imgList: updateReqBody.project_img,
      };

    const inputData: Project.UpdateInput = updateReqBody;

    const updatedProjectId: Project.Id = await projectService.editProjectInfo(
      user_id,
      Number(project_id),
      inputData
    );

    res
      .status(200)
      .json({ message: '모집 글 상세 정보 수정 성공', data: { project_id: updatedProjectId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 모집 글 모집 상태 수정 */
export const editProjectStatusHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.params;
    const { project_recruitment_status } = req.body;

    const updatedPeojectId: Project.Id = await projectService.editProjectStatus(
      user_id,
      Number(project_id),
      project_recruitment_status
    );

    res
      .status(200)
      .json({ message: '모집 글 모집 상태 수정 성공', data: { project_id: updatedPeojectId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 모집 글 삭제 */
export const removeProjectHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.params;

    const isDeletedProject = await projectService.removeProject(user_id, Number(project_id));

    if (isDeletedProject) res.status(200).json({ message: '모집 글 삭제 성공', data: {} });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
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
    const { cate, recruiting, keyword, page } = req.query;

    const project_role = cate === 'all' ? undefined : (cate as string);
    const project_status =
      recruiting === 'true' ? 'RECRUITING' : recruiting === 'false' ? 'COMPLETE' : 'all';
    const project_keyword = keyword === 'false' ? undefined : (keyword as string);

    const inputQuery: Project.QueryInput = {
      project_role,
      project_status,
      project_keyword,
      page: Number(page),
    };

    const pagenatedProjectsInfo = await projectService.getAllProjects(user_id, inputQuery);

    res.status(200).json({ message: '전체 모집 글 목록 조회 성공', data: pagenatedProjectsInfo });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 역할 별 모집 글 목록 조회 */
export const getProjectsByRoleHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_role } = req.params;

    const projectsByRole = await projectService.getProjectsByRole(user_id, project_role);

    res.status(200).json({ message: '역할별 모집 글 목록 조회 성공', data: projectsByRole });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 모집 글 상세 정보 조회 */
export const getProjectByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.params;

    const projectInfo = await projectService.getProjectById(user_id, Number(project_id));

    res.status(200).json({ message: '모집 글 상세 정보 조회 성공', data: projectInfo });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 다른 회원 마이페이지 작성 모집 글 목록 조회 */
export const getUserProjectsByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const my_user_id = req.user.user_id;
    const { page } = req.query;
    const { user_id } = req.params;

    const userProjects = await projectService.getMyProjectsById(
      my_user_id,
      Number(user_id),
      Number(page)
    );

    res
      .status(200)
      .json({ message: '다른 회원 마이페이지 작성 모집 글 목록 조회 성공', data: userProjects });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 마이페이지 작성 모집 글 목록 조회 */
export const getMyProjectsByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { page } = req.query;

    const myProjects = await projectService.getMyProjectsById(user_id, user_id, Number(page));

    res.status(200).json({ message: '마이페이지 작성 모집 글 목록 조회 성공', data: myProjects });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 마이페이지 북마크 모집 글 목록 조회 */
export const getMyBookmarkedProjectsByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { page } = req.query;

    const myProjects = await projectService.getMyBookmarkedProjectsById(user_id, Number(page));

    res.status(200).json({ message: '마이페이지 북마크 모집 글 목록 조회 성공', data: myProjects });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
