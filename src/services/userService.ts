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
    const foundHashedPassword = await hashPassword(inputData.user_password);

    inputData.user_password = foundHashedPassword;

    const createdUserId: User.Id = await userRepo.createUser(inputData);

    return createdUserId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 로그인 */
export const logInUser = async (inputData: User.LogInUserInput): Promise<User.InfoWithTokens> => {
  try {
    const foundUserInfoWithPayload: User.InfoWithPayload = await userRepo.findUserPayloadByEmail(
      inputData.user_email
    );

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
    console.log(error);
    throw error;
  }
};

/* 회원 상세 정보 수정 */
export const editUserInfo = async (
  user_id: number,
  inputData: User.UpdatUserInput
): Promise<any> => {
  try {
    await userRepo.isUserIdValid(user_id);

    const updatedUserId = await userRepo.updateUserInfo(user_id, inputData);

    return updatedUserId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 회원 마이페이지 상세 정보 조회 */
export const getUserInfoById = async (user_id: number): Promise<any> => {
  try {
    await userRepo.isUserIdValid(user_id);

    const foundUserInfo = await userRepo.findUserInfoById(user_id);

    return foundUserInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
