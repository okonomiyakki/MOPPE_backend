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
    console.log(error);
    next(error);
  }
};
