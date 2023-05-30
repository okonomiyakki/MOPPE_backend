import { AppError } from '../utils/errorHandler';
import bcrypt from 'bcrypt';
import { signUpUserInput, logInUserInput, updatUserInput } from '../database/types/User';
import * as userRepo from '../database/repository/userRepo';
import env from '../config/envconfig';

/* 비밀번호 해싱 함수 */
const hashPassword = async (password: string) => {
  const saltRounds = Number(env.BCRYPT_SALT_ROUNDS); // salt 반복 횟수

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};

/* 회원 가입 */
const signUpUser = async (inputData: signUpUserInput) => {
  try {
    const foundUser = await userRepo.findUserByEmail(inputData.user_email);

    if (foundUser)
      if (foundUser.user_email === inputData.user_email)
        throw new AppError(400, '이미 존재하는 이메일입니다.');

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

export { signUpUser };
