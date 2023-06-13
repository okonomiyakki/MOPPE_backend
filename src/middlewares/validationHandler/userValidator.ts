import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validateDto } from '../../utils/dtoValidator';
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

    const signUp = new User.SignUpDto(user_name, user_email, user_password);

    validateDto(signUp, next);
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

    const logIn = new User.LogInDto(user_email, user_password);

    validateDto(logIn, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const editUserPassWordValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { user_password, user_new_password } = req.body;

    const EditPassWord = new User.EditPassWordDto(user_id, user_password, user_new_password);

    validateDto(EditPassWord, next);
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

    if (user_name === undefined) {
      delete req.body.user_name;
    }

    if (user_career_goal === undefined) {
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

    const editInfo = new User.EditInfoDto(
      user_id,
      user_name,
      user_career_goal,
      JSON.parse(user_stacks),
      user_introduction,
      filename
    );

    validateDto(editInfo, next);
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

    validateDto(getMemberInfo, next);
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

    validateDto(getMyInfo, next);
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

    const getMembers = new User.GetMembersDto(keyword);

    validateDto(getMembers, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
