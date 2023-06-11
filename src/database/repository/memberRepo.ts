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
