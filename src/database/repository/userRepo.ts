import db from '../../config/dbconfig';
import { AppError } from '../../utils/errorHandler';
import { Email, UserInfoWithPayload } from '../types/UserType';
import { SignUpUserInput } from '../types/UserType';

/* 회원 가입 */
export const createUser = async (inputData: SignUpUserInput): Promise<number> => {
  try {
    const createColums = 'user_email, user_name, user_password';

    const createValues = Object.values(inputData)
      .map((value) => {
        if (value === null) return 'DEFAULT';
        else if (typeof value === 'object') return `'${JSON.stringify(value)}'`;
        else return `'${value}'`;
      })
      .join(', ');

    const SQL = `
    INSERT INTO
    user (${createColums}) 
    VALUES (${createValues})
    `;

    const [createdInfo, _] = await db.query(SQL);

    const createdUserId = (createdInfo as { insertId: number }).insertId;

    return createdUserId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 가입 실패');
  }
};

/* 회원 user_email 조회 */
export const findUserByEmail = async (user_email: string): Promise<Email> => {
  try {
    const selectColums = 'user_email';

    const SQL = `
    SELECT ${selectColums}
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
export const findUserPayloadByEmail = async (user_email: string): Promise<UserInfoWithPayload> => {
  try {
    const selectColums = 'user_id, user_email, user_name, user_img, user_password';

    const SQL = `
    SELECT ${selectColums}
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
