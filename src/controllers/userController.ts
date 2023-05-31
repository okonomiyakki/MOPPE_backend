import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { AuthRequest } from '../database/types/RequestType';
import { SignUpUserInput, LogInUserInput, TokenInfo } from '../database/types/UserType';
import * as userService from '../services/userService';

/* 회원 가입 */
export const signUpUserHandler = async (
  req: Request,
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
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 회원 가입 실패'));
    }
  }
};

/* 로그인 */
export const logInUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const inputData: LogInUserInput = {
      user_email,
      user_password,
    };

    const foundUserToken: TokenInfo = await userService.logInUser(inputData);

    // res.setHeader('Authorization', `Bearer ${foundUserToken.accessToken}`);

    res.cookie('Authorization', `Bearer ${foundUserToken.accessToken}`, {
      httpOnly: false,
      // secure: true,
    });

    res.cookie('RefreshToken', foundUserToken.refreshToken, {
      httpOnly: false,
      // secure: true,
    });

    res.status(200).json({ message: '로그인 성공' });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 로그인 실패'));
    }
  }
};

/* 로그아웃 */
export const logOutUserHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;

    if (isNaN(Number(user_id))) throw new AppError(400, '정상적인 로그인 상태가 아닙니다.');

    res.clearCookie('Authorization');

    res.clearCookie('RefreshToken');

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 로그아웃 실패'));
    }
  }
};
