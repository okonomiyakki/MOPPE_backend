import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { SignUpUserInput, LogInUserInput, TokenInfo } from '../database/types/User';
import * as userService from '../services/userService';

/* 회원 가입 */
const signUpUserHandler = async (
  req: Request<
    {},
    {},
    {
      user_email: string;
      user_name: string;
      user_password: string;
    }
  >,
  res: Response<{ message: string; data: { user_id: number } }>,
  next: NextFunction
) => {
  try {
    const { user_email, user_name, user_password } = req.body;

    if (!user_email || !user_name || !user_password)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const inputData: SignUpUserInput = {
      user_email,
      user_name,
      user_password,
    };

    const createdUserId = await userService.signUpUser(inputData);

    res.status(201).json({ message: '회원 가입 성공', data: { user_id: createdUserId } });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 회원 가입 실패'));
    }
  }
};

/* 로그인 */
const logInUserHandler = async (
  req: Request<
    {},
    {},
    {
      user_email: string;
      user_password: string;
    }
  >,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  try {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const inputData: LogInUserInput = {
      user_email,
      user_password,
    };

    const foundUserToken: TokenInfo = await userService.logInUser(inputData);

    res.setHeader('Authorization', `Bearer ${foundUserToken.accessToken}`);

    res.cookie('refreshToken', foundUserToken.refreshToken, {
      httpOnly: false,
      // secure: true, // https 되면
    });

    res.status(200).json({ message: '로그인 성공' });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 로그인 실패'));
    }
  }
};

export { signUpUserHandler, logInUserHandler };
