import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';
import * as User from '../../types/UserType';

/* 회원 가입 */
export const createUser = async (inputData: User.SignUpUserInput): Promise<User.Id> => {
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

    const createdUserId: User.Id = (createdInfo as { insertId: number }).insertId;

    return createdUserId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 가입 실패');
  }
};

/* 회원 user_email 조회 */
export const findUserByEmail = async (user_email: string): Promise<User.Email> => {
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
export const findUserPayloadByEmail = async (user_email: string): Promise<User.InfoWithPayload> => {
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

/* 회원 상세 정보 수정 */
export const updateUserInfo = async (
  user_id: number,
  inputData: User.UpdatUserInput
): Promise<number> => {
  try {
    const updateColums = Object.entries(inputData)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = ?`)
      .join(', ');

    const updateValues = Object.values(inputData).filter((value) => value !== undefined);

    const SQL = `
      UPDATE user
      SET ${updateColums}
      WHERE user_id = ?
    `;

    const [result, _] = await db.execute(SQL, [...updateValues, user_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;
    const isMatched = Number((result as { info: string }).info.split(' ')[2]) === 1 ? true : false;
    const isChanged = Number((result as { info: string }).info.split(' ')[5]) === 1 ? true : false;

    if (isAffected && isMatched && !isChanged)
      throw new AppError(400, '[ DB 에러 ] 수정하실 내용이 기존과 동일합니다.');

    if (!isAffected && !isMatched && !isChanged)
      throw new AppError(403, '[ DB 에러 ] 회원 본인만 수정할 수 있습니다.');

    return user_id;
  } catch (error) {
    console.log(error);
    throw error;
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
