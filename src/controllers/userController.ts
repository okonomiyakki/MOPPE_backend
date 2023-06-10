import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as userService from '../services/userService';
import * as User from '../types/UserType';

/* 회원 가입 */
export const signUpUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_name, user_password } = req.body;

    if (!user_email || !user_name || !user_password)
      AppErrors.handleBadRequest('요청 body에 모든 정보를 입력해 주세요.');

    // TODO] validator 에서 요청 body 타입 유효성 검사 추가

    const inputData: User.SignUpUserInput = {
      user_email,
      user_name,
      user_password,
    };

    const createdUserId: User.Id = await userService.signUpUser(inputData);

    res.status(201).json({ message: '회원 가입 성공', data: { user_id: createdUserId } });
  } catch (error) {
    error instanceof AppError
      ? next(error)
      : next(AppErrors.handleInternalServerError('이미 존재하는 이메일 입니다.'));
  }
};

/* 로그인 */
export const logInUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password)
      AppErrors.handleBadRequest('요청 body에 모든 정보를 입력해 주세요.');

    // TODO] validator 에서 요청 body 타입 유효성 검사 추가

    const inputData: User.LogInUserInput = {
      user_email,
      user_password,
    };

    const infoWithTokens: User.InfoWithTokens = await userService.logInUser(inputData);

    const userInfoWithTokens = {
      accessToken: infoWithTokens.accessToken,
      refreshToken: infoWithTokens.refreshToken,
      user_id: infoWithTokens.user_id,
      user_name: infoWithTokens.user_name,
      user_img: infoWithTokens.user_img,
      user_career_goal: infoWithTokens.user_career_goal,
      user_stacks: infoWithTokens.user_stacks,
      user_introduction: infoWithTokens.user_introduction,
    };

    res.status(200).json({ message: '로그인 성공', data: userInfoWithTokens });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 로그아웃 */
export const logOutUserHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO] 토큰 만료시간 초기화?

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 회원 상세 정보 수정 */
export const editUserInfoHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.user_id === 0)
      AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;
    const { user_name, user_career_goal, user_stacks, user_introduction } = req.body;
    const { filename } = req.file || {};

    const imgFileRoot =
      filename === undefined ? undefined : `http://localhost:5500/api/v1/static/user/${filename}`;

    if (!user_name && !user_career_goal && !user_stacks && !user_introduction && !filename)
      AppErrors.handleBadRequest('수정하실 정보를 하나 이상 입력해 주세요.');

    // TODO] validator 에서 요청 body 타입 유효성 검사 추가

    const inputData: User.UpdatUserInput = {
      user_name,
      user_career_goal,
      user_stacks: {
        stackList: JSON.parse(user_stacks),
      },
      user_introduction,
      user_img: imgFileRoot,
    };

    const updatedUserId: User.Id = await userService.editUserInfo(user_id, inputData);

    res.status(200).json({ message: '회원 상세 정보 수정 성공', data: { user_id: updatedUserId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 다른 회원 마이페이지 상세 정보 조회 */
export const getUserInfoByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.user_id === 0)
      AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.params;

    if (!user_id) AppErrors.handleBadRequest('user_id를 입력해주세요.');

    if (isNaN(Number(user_id))) AppErrors.handleBadRequest('유효한 user_id를 입력해주세요.');

    const userInfo = await userService.getUserInfoById(Number(user_id));

    res.status(200).json({ message: '다른 회원 마이페이지 정보 조회 성공', data: userInfo });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 회원 마이페이지 상세 정보 조회 */
export const getMyInfoByIdHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.user_id === 0)
      AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;

    const myInfo = await userService.getUserInfoById(user_id);

    res.status(200).json({ message: '회원 마이페이지 정보 조회 성공', data: myInfo });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
