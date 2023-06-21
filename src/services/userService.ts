import bcrypt from 'bcrypt';
import hashPassword from '../utils/passwordHasher';
import jwt from 'jsonwebtoken';
import env from '../config/envconfig';
import * as AppErrors from '../middlewares/errorHandler';
import * as userRepo from '../database/repository/userRepo';
import * as User from '../types/UserType';
import { login } from '../utils/generateTokensForLogIn';

/* 회원 가입 */
export const signUpUser = async (inputData: User.SignUpUserInput): Promise<User.Id> => {
  try {
    const foundHashedPassword = await hashPassword(inputData.user_password);

    inputData.user_password = foundHashedPassword;

    const createdUserId: User.Id = await userRepo.createUser(inputData);

    return createdUserId;
  } catch (error) {
    throw error;
  }
};

/* 카카오 로그인 */
export const kakaoLogin = async (inputData: User.KakaoLogInInput): Promise<User.InfoWithTokens> => {
  try {
    const foundUser = await userRepo.isUserEmailValid(inputData.user_email);

    if (!foundUser) {
      await userRepo.createUserByKakao(inputData);

      return login(inputData);
    } else {
      if (foundUser.user_name !== inputData.user_name)
        await userRepo.updateUserNameByKakao(foundUser.user_id, inputData.user_name);

      return login(inputData);
    }
  } catch (error) {
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

    if (!isPasswordMatch) throw AppErrors.handleBadRequest('비밀번호가 일치하지 않습니다.');

    const payload: User.Payload = {
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
      user_career_goal: foundUserInfoWithPayload.user_career_goal,
      user_stacks: foundUserInfoWithPayload.user_stacks,
      user_introduction: foundUserInfoWithPayload.user_introduction,
    };

    const userInfoWithTokens: User.InfoWithTokens = {
      accessToken,
      refreshToken,
      ...userInfo,
    };

    return userInfoWithTokens;
  } catch (error) {
    throw error;
  }
};

/* 회원 비밀번호 수정*/
export const editUserPassWord = async (
  user_id: number,
  user_password: string,
  user_new_password: string
): Promise<any> => {
  try {
    const foundUserPassWord = await userRepo.isUserValid(user_id);

    const isPasswordMatch = await bcrypt.compare(user_password, foundUserPassWord.user_password);

    if (!isPasswordMatch) throw AppErrors.handleBadRequest('비밀번호가 일치하지 않습니다.');

    const foundHashedNewPassword = await hashPassword(user_new_password);

    const updatedUserId = await userRepo.updateUserPassWord(user_id, foundHashedNewPassword);

    return updatedUserId;
  } catch (error) {
    throw error;
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
    throw error;
  }
};

/* 회원 탈퇴 */
export const removeUser = async (user_id: number, user_password: string): Promise<boolean> => {
  try {
    const foundUserPassWord = await userRepo.isUserValid(user_id);

    const isPasswordMatch = await bcrypt.compare(user_password, foundUserPassWord.user_password);

    if (!isPasswordMatch) throw AppErrors.handleBadRequest('비밀번호가 일치하지 않습니다.');

    const isDeletedUser = await userRepo.deleteUserById(user_id);

    return isDeletedUser;
  } catch (error) {
    throw error;
  }
};

/* 회원 마이페이지 상세 정보 조회 */
export const getUserInfoById = async (user_id: number): Promise<any> => {
  try {
    await userRepo.isUserValid(user_id);

    const foundUserInfo = await userRepo.findUserInfoById(user_id);

    return foundUserInfo;
  } catch (error) {
    throw error;
  }
};

/* 키워드 별 회원 검색  */
export const getMembersBykeyword = async (user_keyword: string): Promise<any> => {
  try {
    const foundMembers = await userRepo.findMembersBykeyword(user_keyword);

    return foundMembers;
  } catch (error) {
    throw error;
  }
};
