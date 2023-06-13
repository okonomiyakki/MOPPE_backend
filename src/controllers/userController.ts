import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import axios from 'axios';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as userService from '../services/userService';
import * as User from '../types/UserType';

/* 회원 가입 */
export const signUpUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_name, user_password } = req.body;

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

/* 카카오 로그인 */
export const kakaoLoginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('client_id', '3d7a11e63027aef74354e247728d509d');
    tokenParams.append('redirect_uri', 'http://localhost:3000/login');
    tokenParams.append('code', code as string);

    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', tokenParams);
    const { access_token } = tokenResponse.data;

    // 사용자 정보 요청을 위한 헤더 설정
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    // 사용자 정보 요청
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', config);
    const userData = userResponse.data;

    console.log(userData);

    if (userData.kakao_account.is_email_valid === false)
      throw AppErrors.handleBadRequest('이메일 수집 동의가 필요합니다.');

    const inputData: User.KakaoLogInInput = {
      user_email: userData.kakao_account.email,
      user_name: userData.properties.nickname,
    };

    const userInfoWithTokens: User.InfoWithTokens = await userService.kakaoLogin(inputData);

    res.status(200).json({ message: '로그인 성공', data: userInfoWithTokens });
  } catch (error) {
    console.log(error);
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 로그인 */
export const logInUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_password } = req.body;

    const inputData: User.LogInUserInput = {
      user_email,
      user_password,
    };

    const userInfoWithTokens: User.InfoWithTokens = await userService.logInUser(inputData);

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

/* 회원 비밀번호 수정  */
export const editUserPassWordHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { user_password, user_new_password } = req.body;

    const updatedUserId = await userService.editUserPassWord(
      user_id,
      user_password,
      user_new_password
    );

    res.status(200).json({ message: '회원 비밀번호 수정 성공', data: { user_id: updatedUserId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 회원 상세 정보 수정 */
export const editUserInfoHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;

    const updateReqBody = req.body;

    updateReqBody.user_stacks = { stackList: JSON.parse(updateReqBody.user_stacks) };

    const inputData: User.UpdatUserInput = { ...updateReqBody };

    const updatedUserId: User.Id = await userService.editUserInfo(user_id, inputData);

    res.status(200).json({ message: '회원 상세 정보 수정 성공', data: { user_id: updatedUserId } });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 다른 회원 마이페이지 상세 정보 조회 */
export const getMemberInfoByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;

    const memberInfo = await userService.getUserInfoById(Number(user_id));

    res.status(200).json({ message: '다른 회원 마이페이지 정보 조회 성공', data: memberInfo });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 회원 마이페이지 상세 정보 조회 */
export const getMyInfoByIdHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;

    const myInfo = await userService.getUserInfoById(user_id);

    res.status(200).json({ message: '회원 마이페이지 정보 조회 성공', data: myInfo });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};

/* 키워드 별 회원 검색  */
export const getMembersBykeywordHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword } = req.query as { keyword: string };

    const members = await userService.getMembersBykeyword(keyword);

    res.status(200).json({ message: '키워드 별 회원 검색 성공', data: members });
  } catch (error) {
    error instanceof AppError ? next(error) : next(AppErrors.handleInternalServerError());
  }
};
