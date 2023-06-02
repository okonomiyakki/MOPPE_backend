import db from '../../config/dbconfig';
import { AppError } from '../../utils/errorHandler';
import * as P from '../types/ProjectType';

/* 모집글 등록 */
export const createProject = async (inputData: P.CreateProjectInput): Promise<P.Id> => {
  try {
    const createColumns = `
      user_id,
      project_type,
      project_title, 
      project_summary,
      project_recruitment_roles,
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
    project (${createColumns}) 
    VALUES (${createValues})
    `;

    const [createdInfo, _] = await db.query(SQL);

    const createdProjectId: P.Id = (createdInfo as { insertId: number }).insertId;

    return createdProjectId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 모집글 등록 실패');
  }
};

/* 전체 모집글 목록 조회 */
export const findAllProjects = async (): Promise<any> => {
  try {
    const selectColumns = `
    project.project_id,
    project.project_type,
    project.project_recruitment_status,
    project.project_title,
    project.project_summary,
    project.project_recruitment_roles,
    project.project_required_stacks,
    project.project_goal,
    project.project_participation_time,
    COUNT(bookmark.project_id) AS project_bookmark_count,
    COUNT(comment.project_id) AS project_comments_count,
    project.project_views_count,
    project.project_created_at
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM project
    LEFT JOIN bookmark ON bookmark.project_id = project.project_id
    LEFT JOIN comment ON comment.project_id = project.project_id
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL);

    return projects;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 전체 모집글 목록 조회 실패');
  }
};

/* 역할별 모집글 목록 조회 */
export const findProjectsByRole = async (project_role: string): Promise<any> => {
  try {
    const selectColumns = `
    project.project_id,
    project.project_type,
    project.project_recruitment_status,
    project.project_title,
    project.project_summary,
    project.project_recruitment_roles,
    project.project_required_stacks,
    project.project_goal,
    project.project_participation_time,
    COUNT(bookmark.project_id) AS project_bookmark_count,
    COUNT(comment.project_id) AS project_comments_count,
    project.project_views_count,
    project.project_created_at
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM project
    LEFT JOIN bookmark ON bookmark.project_id = project.project_id
    LEFT JOIN comment ON comment.project_id = project.project_id
    WHERE JSON_CONTAINS(project.project_recruitment_roles->'$.roleList', ?)
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [project_role]);

    return projects;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 역할별 모집글 목록 조회 실패');
  }
};
