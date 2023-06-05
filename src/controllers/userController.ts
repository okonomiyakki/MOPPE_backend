import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { AuthRequest } from '../types/RequestType';
import * as User from '../types/UserType';
import * as userService from '../services/userService';

/* 회원 가입 */
export const signUpUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, user_name, user_password } = req.body;

    if (!user_email || !user_name || !user_password)
      throw new AppError(400, '요청 body에 모든 정보를 입력해 주세요.');

    const inputData: User.SignUpUserInput = {
      user_email,
      user_name,
      user_password,
    };

    const createdUserId: User.Id = await userService.signUpUser(inputData);

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
      throw new AppError(400, '요청 body에 모든 정보를 입력해 주세요.');

    const inputData: User.LogInUserInput = {
      user_email,
      user_password,
    };

    const foundInfoWithTokens: User.InfoWithTokens = await userService.logInUser(inputData);

    const userInfoWithAT = {
      accessToken: foundInfoWithTokens.accessToken,
      user_id: foundInfoWithTokens.user_id,
      user_name: foundInfoWithTokens.user_name,
      user_img: foundInfoWithTokens.user_img,
    };

    // const foundTokens: User.Tokens = {
    //   accessToken: foundInfoWithTokens.accessToken,
    //   refreshToken: foundInfoWithTokens.refreshToken,
    // };

    // const foundLoginInfo: User.Info = {
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

    res.status(200).json({ message: '로그인 성공', data: userInfoWithAT });
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

/* 회원 상세 정보 수정 */
export const editUserInfoHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    const { user_name, user_career_goal, user_stacks, user_introduction, user_img } = req.body;

    if (!user_name && !user_career_goal && !user_stacks && !user_introduction && !user_img)
      throw new AppError(400, '수정하실 정보를 하나 이상 입력해 주세요.');

    const inputData: User.UpdatUserInput = {
      user_name,
      user_career_goal,
      user_stacks,
      user_introduction,
      user_img,
    };

    const updatedUserId: User.Id = await userService.editUserInfo(user_id, inputData);

    res.status(200).json({ message: '회원 상세 정보 수정 성공', data: { user_id: updatedUserId } });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 회원 상세 정보 수정 실패'));
    }
  }
};

/* 회원 마이페이지 상세 정보 조회 */
export const getUserInfoByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.user_id === 0)
      throw new AppError(403, '잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.');

    const { user_id } = req.user;

    const userInfo = await userService.getUserInfoById(user_id);

    res.status(200).json({ message: '회원 마이페이지 정보 조회 성공', data: userInfo });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400 || error.statusCode === 403) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 회원 마이페이지 상세 정보 조회 실패'));
    }
  }
};
