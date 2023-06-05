import db from '../../config/dbconfig';
import { AppError } from '../../middlewares/errorHandler';
import * as Project from '../../types/ProjectType';

/* 모집 글 등록 */
export const createProject = async (inputData: Project.CreateProjectInput): Promise<Project.Id> => {
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
    project (${createColumns}) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result, _] = await db.execute(SQL, createValues);

    const createdProjectId = (result as { insertId: number }).insertId;

    return createdProjectId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 모집 글 등록 실패');
  }
};

/* 모집 글 상세 정보 수정 */
export const updateProjectInfo = async (
  user_id: number,
  project_id: number,
  inputData: Project.UpdateInput
): Promise<number> => {
  try {
    const updateColums = Object.entries(inputData)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = ?`)
      .join(', ');

    const updateValues = Object.values(inputData).filter((value) => value !== undefined);

    const SQL = `
      UPDATE project
      SET ${updateColums}
      WHERE project_id = ? AND user_id = ?
    `;

    const [result, _] = await db.execute(SQL, [...updateValues, project_id, user_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;
    const isMatched = Number((result as { info: string }).info.split(' ')[2]) === 1 ? true : false;
    const isChanged = Number((result as { info: string }).info.split(' ')[5]) === 1 ? true : false;

    if (isAffected && isMatched && !isChanged)
      throw new AppError(400, '[ DB 에러 ] 수정하실 내용이 기존과 동일합니다.');

    if (!isAffected && !isMatched && !isChanged)
      throw new AppError(403, '[ DB 에러 ] 해당 모집 글 작성자만 수정할 수 있습니다.');

    return project_id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 모집 글 모집 상태 수정 */
export const updateProjectStatus = async (
  user_id: number,
  project_id: number,
  project_recruitment_status: string
): Promise<number> => {
  try {
    const SQL = `
      UPDATE project
      SET project_recruitment_status = ?
      WHERE project_id = ? AND user_id = ?
    `;

    const [result, _] = await db.execute(SQL, [project_recruitment_status, project_id, user_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;
    const isMatched = Number((result as { info: string }).info.split(' ')[2]) === 1 ? true : false;
    const isChanged = Number((result as { info: string }).info.split(' ')[5]) === 1 ? true : false;

    if (isAffected && isMatched && !isChanged)
      throw new AppError(400, '[ DB 에러 ] 수정하실 상태는 현재 상태와 동일합니다.');

    if (!isAffected && !isMatched && !isChanged)
      throw new AppError(403, '[ DB 에러 ] 해당 모집 글 작성자만 상태를 변경할 수 있습니다.');

    return project_id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 모집 글 삭제 */
export const deleteProjectById = async (user_id: number, project_id: number): Promise<boolean> => {
  try {
    const SQL = `
    DELETE FROM project
    WHERE project_id = ? AND user_id = ?
    `;

    const [result, _] = await db.execute(SQL, [project_id, user_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;

    if (!isAffected)
      throw new AppError(403, '[ DB 에러 ] 해당 모집 글 작성자만 삭제할 수 있습니다.');

    return true;
  } catch (error) {
    console.log(error);
    throw error;
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
    COUNT(DISTINCT bookmark.user_id) AS project_bookmark_count,
    COUNT(DISTINCT comment.comment_id) AS project_comments_count,
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

    const [projects] = await db.query(SQL);

    return projects; // TODO] as Project.ListByRole[]; 명시적으로 타입 선언
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
    COUNT(DISTINCT bookmark.user_id) AS project_bookmark_count,
    COUNT(DISTINCT comment.comment_id) AS project_comments_count,
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
    project.project_introduction,
    project.project_img,
    project.project_participation_time,
    COUNT(DISTINCT bookmark.user_id) AS project_bookmark_count,
    COUNT(DISTINCT comment.comment_id) AS project_comments_count,
    project.project_views_count,
    project.project_created_at,
    user.user_id,
    user.user_name,
    user.user_introduction,
    user.user_img
    `;

    const SQL = `
    SELECT ${selectColumns}
    FROM project
    LEFT JOIN bookmark ON bookmark.project_id = project.project_id
    LEFT JOIN comment ON comment.project_id = project.project_id
    JOIN user ON user.user_id = project.user_id
    WHERE project.project_id = ?
    `;

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
    COUNT(DISTINCT bookmark.user_id) AS project_bookmark_count,
    COUNT(DISTINCT comment.comment_id) AS project_comments_count,
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
    COUNT(DISTINCT bookmark.user_id) AS project_bookmark_count,
    COUNT(DISTINCT comment.comment_id) AS project_comments_count,
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
