import { AppError } from '../utils/errorHandler';
import { SignUpUserInput, LogInUserInput, PayloadInfo, TokenInfo } from '../database/types/User';
import * as userRepo from '../database/repository/userRepo';
import hashPassword from '../utils/hashPassword';
import env from '../config/envconfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* 회원 가입 */
const signUpUser = async (inputData: SignUpUserInput) => {
  try {
    const foundUser: PayloadInfo = await userRepo.findUserByEmail(inputData.user_email);

    if (foundUser)
      if (foundUser.user_email === inputData.user_email)
        throw new AppError(400, '이미 가입된 이메일입니다.');

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

/* 로그인 */
const logInUser = async (inputData: LogInUserInput): Promise<TokenInfo> => {
  try {
    const foundUser: PayloadInfo = await userRepo.findUserByEmail(inputData.user_email);

    if (!foundUser) throw new AppError(400, '존재하지 않는 아이디 입니다.');

    const isPasswordMatch = await bcrypt.compare(inputData.user_password, foundUser.user_password);

    if (!isPasswordMatch) throw new AppError(400, '비밀번호가 일치하지 않습니다.');

    const payload: PayloadInfo = {
      user_id: foundUser.user_id,
      user_email: foundUser.user_email,
      user_password: foundUser.user_password,
    };

    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'mogakppo_DEFAULT_ACCESS_TOKEN_SECRET';

    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'mogakppo_DEFAULT_REFRESH_TOKEN_SECRET';

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    const foundLogInUserInfo: TokenInfo = { accessToken, refreshToken };

    return foundLogInUserInfo;
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

export { signUpUser, logInUser };
