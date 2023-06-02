import { AppError } from '../middlewares/errorHandler';
import * as stackRepo from '../database/repository/stackRepo';

/* 전체 기술 스택 리스트 조회 */
export const getAllStacks = async (): Promise<any> => {
  try {
    const foundProject = await stackRepo.findAllStacks();

    const stacks = foundProject.map((stack) => stack.stack_name);

    return stacks;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 전체 기술 스택 리스트 조회 실패');
    }
  }
};
