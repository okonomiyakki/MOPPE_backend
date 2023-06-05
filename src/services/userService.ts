import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/envconfig';
import { AppError } from '../middlewares/errorHandler';
import hashPassword from '../utils/passwordHasher';
import * as userRepo from '../database/repository/userRepo';
import * as User from '../types/UserType';

/* 회원 가입 */
export const signUpUser = async (inputData: User.SignUpUserInput): Promise<User.Id> => {
  try {
    const foundUserEmail: User.Email = await userRepo.findUserByEmail(inputData.user_email);

    if (foundUserEmail)
      if (foundUserEmail.user_email === inputData.user_email)
        throw new AppError(404, '이미 가입된 이메일입니다. 다른 이메일을 사용해 주세요.');
    // TODO] 레포지토리 레이어에서 유니크키로 유효성 검사하면 네트워크 요청 줄일 수 있음

    const foundHashedPassword = await hashPassword(inputData.user_password);

    inputData.user_password = foundHashedPassword; // 해싱된 비밀번호

    const createdUserId: User.Id = await userRepo.createUser(inputData);

    return createdUserId;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 회원 가입 실패');
    }
  }
};

/* 로그인 - 토큰 발급하고, 프론트 헤더바에 사용할 회원 필수 정보도 불러오기 */
export const logInUser = async (inputData: User.LogInUserInput): Promise<User.InfoWithTokens> => {
  try {
    const foundUserInfoWithPayload: User.InfoWithPayload = await userRepo.findUserPayloadByEmail(
      inputData.user_email
    );

    if (!foundUserInfoWithPayload)
      throw new AppError(404, '존재하지 않는 이메일입니다. 회원 가입 후 이용해 주세요.');

    const isPasswordMatch = await bcrypt.compare(
      inputData.user_password,
      foundUserInfoWithPayload.user_password
    );

    if (!isPasswordMatch) throw new AppError(404, '비밀번호가 일치하지 않습니다.');

    const payload: User.PayloadInfo = {
      user_id: foundUserInfoWithPayload.user_id,
      user_email: foundUserInfoWithPayload.user_email,
    };

    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_ACCESS_TOKEN_SECRET';

    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'MOGAKPPO_REFRESH_TOKEN_SECRET';

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    const userInfo: User.Info = {
      user_id: foundUserInfoWithPayload.user_id,
      user_name: foundUserInfoWithPayload.user_name,
      user_img: foundUserInfoWithPayload.user_img,
    };

    const userInfoWithTokens: User.InfoWithTokens = {
      accessToken,
      refreshToken,
      ...userInfo,
    };

    return userInfoWithTokens;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 로그인 실패');
    }
  }
};

/* 회원 상세 정보 수정 */
export const editUserInfo = async (
  user_id: number,
  inputData: User.UpdatUserInput
): Promise<any> => {
  try {
    const updatedUserId = await userRepo.updateUserInfo(user_id, inputData);

    return updatedUserId;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 회원 상세 정보 수정 실패');
    }
  }
};

/* 회원 마이페이지 상세 정보 조회 */
export const getUserInfoById = async (user_id: number): Promise<any> => {
  try {
    const foundUserInfo = await userRepo.findUserInfoById(user_id);

    return foundUserInfo;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 회원 마이페이지 정보 상세 조회 실패');
    }
  }
};
