import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { AuthRequest } from '../types/RequestType';
import * as User from '../types/UserType';
import * as userService from '../services/userService';

/* 회원 가입 */
export const signUpUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_name, user_password } = req.body;

    if (!user_email || !user_name || !user_password)
      throw new AppError(400, '요청 body에 모든 정보를 입력해 주세요.');

    const inputData: User.SignUpUserInput = {
      user_email,
      user_name,
      user_password,
    };

    const createdUserId: User.Id = await userService.signUpUser(inputData);

    res.status(201).json({ message: '회원 가입 성공', data: { user_id: createdUserId } });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* 로그인 */
export const logInUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password)
      throw new AppError(400, '요청 body에 모든 정보를 입력해 주세요.');

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
    };

    res.status(200).json({ message: '로그인 성공', data: userInfoWithTokens });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* 로그아웃 */
export const logOutUserHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO] 토큰 만료시간 초기화?

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* 회원 상세 정보 수정 */
export const editUserInfoHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.user_id === 0)
      throw new AppError(403, '잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;
    const { user_name, user_career_goal, user_introduction } = req.body;
    const stackList = req.body.user_stacks;
    const { filename } = req.file || {};

    const stacks = JSON.parse(stackList);

    const user_stacks: any = {
      stackList: stacks,
    };

    const imgFileRoot =
      filename === undefined ? undefined : `http://localhost:5500/api/v1/static/${filename}`;

    if (!user_name && !user_career_goal && !user_stacks && !user_introduction && !filename)
      throw new AppError(400, '수정하실 정보를 하나 이상 입력해 주세요.');

    const inputData: User.UpdatUserInput = {
      user_name,
      user_career_goal,
      user_stacks,
      user_introduction,
      user_img: imgFileRoot,
    };

    const updatedUserId: User.Id = await userService.editUserInfo(user_id, inputData);

    res.status(200).json({ message: '회원 상세 정보 수정 성공', data: { user_id: updatedUserId } });
  } catch (error) {
    console.log(error);
    next(error);
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
      throw new AppError(403, '잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.params;

    const userInfo = await userService.getUserInfoById(Number(user_id));

    res.status(200).json({ message: '다른 회원 마이페이지 정보 조회 성공', data: userInfo });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* 회원 마이페이지 상세 정보 조회 */
export const getMyInfoByIdHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.user_id === 0)
      throw new AppError(403, '잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;

    const myInfo = await userService.getUserInfoById(user_id);

    res.status(200).json({ message: '회원 마이페이지 정보 조회 성공', data: myInfo });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
