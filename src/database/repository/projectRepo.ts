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

/* 역할별 모집글 목록 조회 */
export const findProjectByRole = async (project_role: string): Promise<P.ListByRole[]> => {
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
    `;

    const [projects]: any = await db.query(SQL, [project_role]);

    return projects;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 역할별 모집글 목록 실패');
  }
};

// {
// "project_id": 1,
// "project_type": "사이드 프로젝트",
// "project_recruitment_status": "모집 중",
// "project_title": "Web Development project Group",
// "project_summary": "Join us to learn and collaborate on web development projects.",
// "project_recruitment_roles": { "roleList": ["프론트엔드", "백엔드"] },
// "project_required_stacks": { "stackList": ["HTML", "CSS", "JavaScript"] },
// "project_goal": "포트폴리오/직무 역량 강화",
// "project_participation_time": "매주 4시간 이하",
// "project_bookmark_count": 0,
// "project_comments_count": 0,
// "project_views_count": 0,
// "project_created_at": "2023-05-01 15:21:41"
// },
