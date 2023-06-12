import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validateDto } from '../../utils/dtoValidator';
import env from '../../config/envconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as Project from '../../database/dtos/projectDto';

export const addProjectValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const {
      project_type,
      project_title,
      project_summary,
      project_recruitment_roles,
      project_required_stacks,
      project_goal,
      project_participation_time,
      project_introduction,
    } = req.body;
    const fileList = req.files as any[];

    if (user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    if (fileList.length > 0) {
      const imgFileRoots = fileList.map(
        (file) => `${env.PROJECT_IMAGE_ROOT_LOCAL}${file.filename}`
      );
      req.body.project_img = imgFileRoots;
    }

    if (fileList.length === 0) req.body.project_img = [];

    const addProject = new Project.AddProjectDto(
      user_id,
      project_type,
      project_title,
      project_summary,
      JSON.parse(project_recruitment_roles),
      project_goal,
      project_participation_time,
      project_introduction,
      JSON.parse(project_required_stacks),
      fileList
    );

    console.log('addProject : ', addProject);

    validateDto(addProject, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const editProjectInfoValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.params;
    const {
      project_type,
      project_title,
      project_summary,
      project_recruitment_roles,
      project_required_stacks,
      project_goal,
      project_participation_time,
      project_introduction,
    } = req.body;
    const fileList = req.files as any[];

    if (user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    if (project_type === undefined) {
      delete req.body.project_type;
    }
    if (project_title === undefined) {
      delete req.body.project_title;
    }
    if (project_summary === undefined) {
      delete req.body.project_summary;
    }
    if (project_goal === undefined) {
      delete req.body.project_goal;
    }
    if (project_participation_time === undefined) {
      delete req.body.project_participation_time;
    }
    if (project_introduction === undefined) {
      delete req.body.project_introduction;
    }

    if (fileList.length > 0) {
      const imgFileRoots = fileList.map(
        (file) => `${env.PROJECT_IMAGE_ROOT_LOCAL}${file.filename}`
      );
      req.body.project_img = imgFileRoots;
    }

    if (fileList.length === 0) req.body.project_img = [];

    const edirProjectInfo = new Project.EditProjectInfoDto(
      user_id,
      Number(project_id),
      project_type,
      project_title,
      project_summary,
      JSON.parse(project_recruitment_roles),
      project_goal,
      project_participation_time,
      project_introduction,
      JSON.parse(project_required_stacks),
      fileList
    );

    console.log('edirProjectInfo : ', edirProjectInfo);

    validateDto(edirProjectInfo, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const editProjectStatusValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { project_id } = req.params;
    const { project_recruitment_status } = req.body;

    if (user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    const editProjectStatus = new Project.EditProjectStatusDto(
      user_id,
      Number(project_id),
      project_recruitment_status
    );

    console.log('editProjectStatus : ', editProjectStatus);

    validateDto(editProjectStatus, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
