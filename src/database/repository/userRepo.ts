import db from '../../config/dbconfig';
import { AppError } from '../../utils/errorHandler';
import { foundUser } from '../types/UserType';
import { SignUpUserInput } from '../types/UserType';

/* 회원 가입 */
const createUser = async (inputData: SignUpUserInput): Promise<number> => {
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

/* 로그인 */
// const findUser = async (user_email: string, user_password: string) => {
//   try {
//     const selectColums = 'user_email, user_name, user_password';

//     const SQL = `
//       SELECT ${selectColums}
//       FROM user
//       WHERE user_email = ? and user_password = ?
//       `;

//     const [user]: any = await db.query(SQL, [user_email, user_password]);

//     return user[0];
//   } catch (error) {
//     console.log(error);
//     throw new AppError(500, '[ DB 에러 ] 로그인 실패');
//   }
// };

/* 회원 조회 - 유효성 검사용 */
const findUserByEmail = async (user_email: string): Promise<foundUser> => {
  try {
    const selectColums = 'user_id, user_email, user_name, user_password';

    const SQL = `
    SELECT ${selectColums}
    FROM user
    WHERE user_email = ?
    `;

    const [user]: any = await db.query(SQL, [user_email]);

    return user[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 조회 실패');
  }
};

export {
  createUser,
  // findUser,
  findUserByEmail,
};
