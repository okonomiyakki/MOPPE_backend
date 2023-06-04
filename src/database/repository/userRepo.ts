import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';
import * as U from '../../types/UserType';

/* 회원 가입 */
export const createUser = async (inputData: U.SignUpUserInput): Promise<U.Id> => {
  try {
    const createColums = 'user_email, user_name, user_password';

    const createValues = Object.values(inputData);
    // const createValues = Object.values(inputData)
    //   .map((value) => {
    //     if (value === null || undefined) return 'DEFAULT';
    //     else if (typeof value === 'object') return `'${JSON.stringify(value)}'`;
    //     else return `'${value}'`;
    //   })
    //   .join(', ');

    const SQL = `
    INSERT INTO
    user (${createColums}) 
    VALUES (?, ?, ?)
    `;

    const [createdInfo, _] = await db.execute(SQL, createValues);

    const createdUserId: U.Id = (createdInfo as { insertId: number }).insertId;

    return createdUserId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 가입 실패');
  }
};

/* 회원 user_email 조회 */
export const findUserByEmail = async (user_email: string): Promise<U.Email> => {
  try {
    const selectColumns = 'user_email';

    const SQL = `
    SELECT ${selectColumns}
    FROM user
    WHERE user_email = ?
    `;

    const [foundUserEmail]: any = await db.query(SQL, [user_email]);

    return foundUserEmail[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 조회 실패');
  }
};

/* 회원 payload, 기본 필드 조회  */
export const findUserPayloadByEmail = async (user_email: string): Promise<U.InfoWithPayload> => {
  try {
    const selectColumns = 'user_id, user_email, user_name, user_img, user_password';

    const SQL = `
    SELECT ${selectColumns}
    FROM user
    WHERE user_email = ?
    `;

    const [foundUserInfoWithPayload]: any = await db.query(SQL, [user_email]);

    return foundUserInfoWithPayload[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 payload 조회 실패');
  }
};

/* 회원 마이페이지 상세 정보 조회  */
export const findUserInfoById = async (user_id: number): Promise<any> => {
  try {
    const selectColumns = 'user_name, user_career_goal, user_stacks, user_introduction, user_img';

    const SQL = `
    SELECT ${selectColumns}
    FROM user
    WHERE user_id = ?
    `;

    const [foundUserInfo]: any = await db.query(SQL, [user_id]);

    return foundUserInfo[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 마이페이지 상세 정보 조회 실패');
  }
};
