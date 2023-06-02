import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import * as stackService from '../services/stackService';

/* 전체 기술 스택 리스트 조회 */
export const getAllStacksHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundStacks = await stackService.getAllStacks();

    res
      .status(200)
      .json({ message: '전체 기술 스택 리스트 조회 성공', data: { stackList: foundStacks } });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 전체 기술 스택 리스트 조회 실패'));
    }
  }
};
