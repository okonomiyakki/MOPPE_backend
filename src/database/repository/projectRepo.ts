import db from '../../config/dbconfig';
import { AppError } from '../../utils/errorHandler';
import { CreateProjectInput } from '../types/ProjectType';

/* 모집글 등록 */
export const createProject = async (inputData: CreateProjectInput) => {
  try {
    const createColums = `
      user_id,
      project_type,
      project_title, 
      project_summary,
      project_recruitment_role,
      project_required_stacks,
      project_goal,
      project_participation_time,
      project_introduction,
      project_img
      `;

    const createValues = Object.values(inputData)
      .map((value) => {
        if (value === null) return 'DEFAULT';
        else if (typeof value === 'object') return `'${JSON.stringify(value)}'`;
        else return `'${value}'`;
      })
      .join(', ');

    const SQL = `
    INSERT INTO
    project (${createColums}) 
    VALUES (${createValues})
    `;

    const [createdInfo, _] = await db.query(SQL);

    const createdProjectId = (createdInfo as { insertId: number }).insertId;

    return createdProjectId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 모집글 등록 실패');
  }
};
