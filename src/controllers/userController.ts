import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { AuthRequest } from '../types/RequestType';
import * as U from '../types/UserType';
import * as userService from '../services/userService';

/* 회원 가입 */
export const signUpUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_name, user_password } = req.body;

    if (!user_email || !user_name || !user_password)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const inputData: U.SignUpUserInput = {
      user_email,
      user_name,
      user_password,
    };

    const createdUserId: U.Id = await userService.signUpUser(inputData);

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

    const inputData: U.LogInUserInput = {
      user_email,
      user_password,
    };

    const foundInfoWithTokens: U.InfoWithTokens = await userService.logInUser(inputData);

    const infoWithAT = {
      accessToken: foundInfoWithTokens.accessToken,
      user_id: foundInfoWithTokens.user_id,
      user_name: foundInfoWithTokens.user_name,
      user_img: foundInfoWithTokens.user_img,
    };

    // const foundTokens: U.Tokens = {
    //   accessToken: foundInfoWithTokens.accessToken,
    //   refreshToken: foundInfoWithTokens.refreshToken,
    // };

    // const foundLoginInfo: U.Info = {
    //   user_id: foundInfoWithTokens.user_id,
    //   user_name: foundInfoWithTokens.user_name,
    //   user_img: foundInfoWithTokens.user_img,
    // };

    // res.setHeader('Authorization', `Bearer ${foundInfoWithTokens.accessToken}`);

    // res.cookie('Authorization', `Bearer ${foundInfoWithTokens.accessToken}`, {
    //   httpOnly: false,
    //   // secure: true,
    // });

    res.cookie('RT', foundInfoWithTokens.refreshToken, {
      httpOnly: true,
      path: '/' /* 해당 도메인 하의 모든 경로에서 쿠키 사용 가능 */,
      // domain: 'example.com', /* 클라이언트 도메인 주소 */
      // secure: true, /* https 에서만 쿠키 전송 가능 */
    });

    res.status(200).json({ message: '로그인 성공', data: infoWithAT });
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
    // res.clearCookie('Authorization');

    res.clearCookie('RT');

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
