import * as stackRepo from '../database/repository/stackRepo';
import * as userRepo from '../database/repository/userRepo';
import { countUserStacksFrequency } from '../utils/stackFrequencyCounter';

/* 전체 기술 스택 리스트 조회 */
export const getAllStacks = async (): Promise<any> => {
  try {
    const foundProject = await stackRepo.findAllStacks();

    const stacks = foundProject.map((stack) => stack.stack_name);

    const userStackList = await userRepo.findBestStacks();

    const bestStacks = countUserStacksFrequency(userStackList);

    const stacksInfo = {
      bestStacks,
      stacks,
    };

    return stacksInfo;
  } catch (error) {
    throw error;
  }
};
