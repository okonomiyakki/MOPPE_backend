import { AppError } from '../utils/errorHandler';
import hashPassword from '../utils/hashPassword';
import env from '../config/envconfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as U from '../database/types/UserType';
import * as userRepo from '../database/repository/userRepo';

/* 회원 가입 */
export const signUpUser = async (inputData: U.SignUpUserInput) => {
  try {
    const foundUserEmail: U.Email = await userRepo.findUserByEmail(inputData.user_email);

    if (foundUserEmail)
      if (foundUserEmail.user_email === inputData.user_email)
        throw new AppError(404, '이미 가입된 이메일입니다. 다른 이메일을 사용해 주세요.');

    const hashedPassword = await hashPassword(inputData.user_password);

    inputData.user_password = hashedPassword; // 해싱된 비밀번호

    const createdUserId: number = await userRepo.createUser(inputData);

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

/* 로그인 - 토큰을 발급, 회원 */
export const logInUser = async (inputData: U.LogInUserInput): Promise<U.InfoWithTokens> => {
  try {
    const foundUserInfoWithPayload: U.InfoWithPayload = await userRepo.findUserPayloadByEmail(
      inputData.user_email
    );

    if (!foundUserInfoWithPayload)
      throw new AppError(404, '존재하지 않는 이메일입니다. 회원 가입 후 이용해 주세요.');

    const isPasswordMatch = await bcrypt.compare(
      inputData.user_password,
      foundUserInfoWithPayload.user_password
    );

    if (!isPasswordMatch) throw new AppError(404, '비밀번호가 일치하지 않습니다.');

    const payload: U.PayloadInfo = {
      user_id: foundUserInfoWithPayload.user_id,
      user_email: foundUserInfoWithPayload.user_email,
      user_password: foundUserInfoWithPayload.user_password, // 뺴기
    };

    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_ACCESS_TOKEN_SECRET';

    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'MOGAKPPO_REFRESH_TOKEN_SECRET';

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    const userInfo: U.Info = {
      user_id: foundUserInfoWithPayload.user_id,
      user_name: foundUserInfoWithPayload.user_name,
      user_img: foundUserInfoWithPayload.user_img,
    };

    const userInfoWithTokens: U.InfoWithTokens = {
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
