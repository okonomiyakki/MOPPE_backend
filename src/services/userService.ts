import bcrypt from 'bcrypt';
import hashPassword from '../utils/passwordHasher';
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

    const foundUserInfoWithPayload: User.InfoWithPayload = await userRepo.findUserPayloadByEmail(
      inputData.user_email
    );

    console.log(foundUser);
    console.log(inputData);

    if (!foundUser) {
      await userRepo.createUserByKakao(inputData);

      return login(foundUserInfoWithPayload);
    } else {
      if (foundUser.user_name !== inputData.user_name)
        await userRepo.updateUserNameByKakao(foundUser.user_id, inputData.user_name);

      return login(foundUserInfoWithPayload);
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

    return login(foundUserInfoWithPayload);
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
