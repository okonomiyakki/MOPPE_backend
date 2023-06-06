import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';

/* 전체 기술 스택 리스트 조회 */
export const findAllStacks = async (): Promise<any[]> => {
  try {
    const selectColumn = `
    stack_name
    `;

    const SQL = `
    SELECT ${selectColumn}
    FROM stack
    `;

    const [stacks]: any = await db.query(SQL);

    return stacks;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '기술 스택 리스트 조회 중 오류가 발생했습니다.');
  }
};
