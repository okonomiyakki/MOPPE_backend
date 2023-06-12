import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validateOrReject, ValidationError } from 'class-validator';
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
    await validateOrReject(addProject)
      .then(next)
      .catch((errors: ValidationError[]) => {
        console.log('Validation Info : ', errors);
        const errorMessage = errors
          .map((error) => (error.constraints ? Object.values(error.constraints).join(' ') : ''))
          .join(' & ');

        next(AppErrors.handleBadRequest(errorMessage));
      });
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
