import { AppError } from '../middlewares/errorHandler';
import * as stackRepo from '../database/repository/stackRepo';

/* 전체 기술 스택 리스트 조회 */
export const getAllStacks = async (): Promise<any> => {
  try {
    const foundProject = await stackRepo.findAllStacks();

    const stacks = foundProject.map((stack) => stack.stack_name);

    return stacks;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
