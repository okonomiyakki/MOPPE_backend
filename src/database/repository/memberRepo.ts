import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as Member from '../../types/MemberType';

/* 포트폴리오 멤버 등록 */
export const createMember = async (user_id: number, portfolio_id: number): Promise<Member.Id> => {
  try {
    const createColumn = `
    user_id,
    portfolio_id
    `;

    // const createValues = Object.values(inputData);

    const SQL = `
    INSERT INTO
    member (${createColumn}) 
    VALUES (?, ?)
    `;

    const [createdInfo, _] = await db.execute(SQL, [user_id, portfolio_id]);

    const createdMemberId: Member.Id = (createdInfo as { insertId: number }).insertId;

    return createdMemberId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// /* 포트폴리오 멤버 수정 */
// export const updateMember = async (user_id: number, portfolio_id: number): Promise<Member.Id> => {
//   try {
//     const createColumn = `
//     user_id,
//     portfolio_id
//     `;

//     // const createValues = Object.values(inputData);

//     const SQL = `
//     UPDATE member
//     SET ${updateColums}
//     WHERE user_id = ? AND comment_id = ?
//     `;

//     const [createdInfo, _] = await db.execute(SQL, [user_id, portfolio_id]);

//     const createdMemberId: Member.Id = (createdInfo as { insertId: number }).insertId;

//     return createdMemberId;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

/* 포트폴리오 별 참여한 멤버 정보 조회 */
export const findParticipatedMembersById = async (portfolio_id: number): Promise<any> => {
  try {
    const selectColumns = `
    user.user_id,
    user.user_name,
    user.user_email,
    user.user_career_goal,
    user.user_img
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM member
    INNER JOIN user ON member.user_id = user.user_id
    WHERE member.portfolio_id = ?
    `;

    const [members]: any = await db.query(SQL, [portfolio_id]);

    return members;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
