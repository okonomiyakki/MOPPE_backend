import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';
import * as P from '../../types/ProjectType';

/* 모집 글 등록 */
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
    throw new AppError(500, '[ DB 에러 ] 모집 글 등록 실패');
  }
};

/* 전체 모집 글 목록 조회 */
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
    throw new AppError(500, '[ DB 에러 ] 전체 모집 글 목록 조회 실패');
  }
};

/* 역할 별 모집 글 목록 조회 */
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
    throw new AppError(500, '[ DB 에러 ] 역할 별 모집 글 목록 조회 실패');
  }
};

/* 모집 글 상세 정보 조회 */
export const findProjectById = async (project_id: number): Promise<any> => {
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
    project.project_created_at,
    user.user_id,
    user.user_name,
    user.user_introduction,
    user.user_img,
    JSON_ARRAYAGG(
      JSON_OBJECT('user_id', user_bookmark.user_id, 'user_name', user_bookmark.user_name, 'user_img', user_bookmark.user_img)
    ) AS project_bookmark_users
    `;

    const selectJoinColumns = `bookmark.project_id, user.user_id, user.user_name, user.user_img`;

    const SQL = `
    SELECT ${selectColumns}
    FROM project
    LEFT JOIN bookmark ON bookmark.project_id = project.project_id
    LEFT JOIN comment ON comment.project_id = project.project_id
    JOIN user ON user.user_id = project.user_id
    LEFT JOIN (
    SELECT DISTINCT ${selectJoinColumns}
    FROM bookmark
    INNER JOIN user ON bookmark.user_id = user.user_id
    ) AS user_bookmark ON project.project_id = user_bookmark.project_id
    WHERE project.project_id = ?
    GROUP BY bookmark.user_id
    `;
    // GROUP BY bookmark.user_id
    // DISTINCT;
    const [project]: any = await db.query(SQL, [project_id]);

    return project[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 모집 글 상세 정보 조회 실패');
  }
};

/* 마이페이지 회원 별 작성 모집 글 목록 조회 */
export const findMyProjectsById = async (user_id: number): Promise<any> => {
  try {
    const selectColumns = `
    project.project_id,
    project.project_type,
    project.project_recruitment_status,
    project.project_goal,
    project.project_title,
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
    WHERE project.user_id = ?
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [user_id]);

    return projects;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 마이페이지 회원 별 작성 모집 글 목록 조회 실패');
  }
};

/* 마이페이지 회원 별 북마크 모집 글 목록 조회 */
export const findMyBookmarkedProjectsById = async (user_id: number): Promise<any> => {
  try {
    const selectColumns = `
    project.project_id,
    project.project_type,
    project.project_recruitment_status,
    project.project_goal,
    project.project_title,
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
    WHERE project.user_id = ? AND bookmark.user_id = ?
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [user_id, user_id]);

    return projects;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 마이페이지 회원 별 북마크 모집 글 목록 조회 실패');
  }
};
