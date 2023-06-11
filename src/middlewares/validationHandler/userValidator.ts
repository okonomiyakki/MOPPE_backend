import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validateOrReject, ValidationError } from 'class-validator';
import env from '../../config/envconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as User from '../../database/dtos/userDto';

export const signUpUserValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_email, user_name, user_password } = req.body;

    const userSignUp = new User.SignUpDto(user_email, user_name, user_password);

    await validateOrReject(userSignUp)
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

export const logInUserValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_email, user_password } = req.body;

    const userLogIn = new User.LogInDto(user_email, user_password);

    await validateOrReject(userLogIn)
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

export const editUserInfoValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { user_name, user_career_goal, user_stacks, user_introduction } = req.body;
    const { filename } = req.file || {};

    if (user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    if (user_name === undefined) {
      delete req.body.user_name;
    }

    if (user_career_goal === undefined) {
      delete req.body.user_career_goal;
    }

    if (user_stacks === undefined) {
      delete req.body.user_career_goal;
    }

    if (user_introduction === undefined) {
      delete req.body.user_introduction;
    }

    /* 이미지 파일이 있으면 body 필드에 이미지 파일 경로 프러퍼티 추가 */
    if (filename !== undefined) {
      const imgFileRoot = `${env.USER_IMAGE_ROOT_LOCAL}${filename}`;
      req.body.user_img = imgFileRoot;
    }

    const userEditInfo = new User.EditInfoDto(
      user_id,
      user_name,
      user_career_goal,
      JSON.parse(user_stacks),
      user_introduction,
      filename
    );

    console.log('userEditInfo : ', userEditInfo);
    await validateOrReject(userEditInfo)
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

export const getMemberInfoValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;

    const getMemberInfo = new User.GetMemberInfoDto(Number(user_id));

    await validateOrReject(getMemberInfo)
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

export const getMyInfoValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;

    if (req.user.user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    const getMyInfo = new User.GetMyInfoDto(Number(user_id));

    await validateOrReject(getMyInfo)
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

export const getMembersValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword } = req.query as { keyword: string };

    if (req.user.user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    const GetMembers = new User.GetMembersDto(keyword);

    await validateOrReject(GetMembers)
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
