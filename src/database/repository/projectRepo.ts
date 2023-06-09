import db from '../../config/dbconfig';
import * as AppErrors from '../../middlewares/errorHandler';
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
    throw error;
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
    WHERE user_id = ? AND project_id = ?
    `;

    const [result, _] = await db.execute(SQL, [...updateValues, user_id, project_id]);
    console.log(result);
    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;

    const isMatched = Number((result as { info: string }).info.split(' ')[2]) === 1 ? true : false;

    const isChanged = Number((result as { info: string }).info.split(' ')[5]) === 1 ? true : false;

    if (!isAffected && !isMatched && !isChanged)
      AppErrors.handleForbidden('본인만 수정 가능 합니다.');

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
    WHERE user_id = ? AND project_id = ?
    `;

    const [result, _] = await db.execute(SQL, [project_recruitment_status, user_id, project_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;

    const isMatched = Number((result as { info: string }).info.split(' ')[2]) === 1 ? true : false;

    const isChanged = Number((result as { info: string }).info.split(' ')[5]) === 1 ? true : false;

    if (!isAffected && !isMatched && !isChanged)
      AppErrors.handleForbidden('본인만 수정 가능 합니다.');

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
    WHERE user_id = ? AND project_id = ?
    `;

    const [result, _] = await db.execute(SQL, [user_id, project_id]);

    const isAffected = (result as { affectedRows: number }).affectedRows === 1 ? true : false;

    if (!isAffected) AppErrors.handleForbidden('본인만 삭제 가능 합니다.');

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

    const [projects]: any = await db.query(SQL);

    return projects; // TODO] as Project.ListByRole[]; 명시적으로 타입 선언
  } catch (error) {
    console.log(error);
    throw error;
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
    WHERE JSON_CONTAINS(project.project_recruitment_roles->'$.roleList', JSON_ARRAY(?))
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [project_role]);

    return projects;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 모집 상태 별 모집 글 목록 조회 */
export const findProjectsByStatus = async (project_status: string): Promise<any> => {
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
    WHERE project.project_recruitment_status = ?
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [project_status]);

    return projects;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 모집 역할 및 모집 상태 별 모집 글 목록 조회 */
export const findProjectsByRoleWithStatus = async (
  project_role: string,
  project_status: string
): Promise<any> => {
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
    WHERE JSON_CONTAINS(project.project_recruitment_roles->'$.roleList', JSON_ARRAY(?)) AND project.project_recruitment_status = ?
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [project_role, project_status]);

    return projects;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 키워드 별 모집 글 목록 조회 */
export const findProjectsByKeyword = async (project_keyword: string): Promise<any> => {
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
    WHERE project.project_title LIKE CONCAT('%', ?, '%') 
    OR project.project_summary LIKE CONCAT('%', ?, '%') 
    OR project.project_introduction LIKE CONCAT('%', ?, '%') 
    OR JSON_CONTAINS(project.project_recruitment_roles->'$.roleList', JSON_ARRAY(?))
    OR JSON_CONTAINS(project.project_required_stacks->'$.stackList', JSON_ARRAY(?))
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [
      project_keyword,
      project_keyword,
      project_keyword,
      project_keyword,
      project_keyword,
    ]);

    return projects;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 키워드 및 모집 상태 별 모집 글 목록 조회 */
export const findProjectsByKeywordWithStatus = async (
  project_keyword: string,
  project_status: string
): Promise<any> => {
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
    WHERE (project.project_title LIKE CONCAT('%', ?, '%')
      OR project.project_summary LIKE CONCAT('%', ?, '%')
      OR project.project_introduction LIKE CONCAT('%', ?, '%')
      OR JSON_CONTAINS(project.project_recruitment_roles->'$.roleList', JSON_ARRAY(?))
      OR JSON_CONTAINS(project.project_required_stacks->'$.stackList', JSON_ARRAY(?))
    ) 
    AND project.project_recruitment_status = ?
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [
      project_keyword,
      project_keyword,
      project_keyword,
      project_keyword,
      project_keyword,
      project_status,
    ]);

    return projects;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 댓글 등록 및 북마크 등록, 삭제 시 모집 글 유효성 검사 */
export const isProjectValid = async (project_id: number): Promise<void> => {
  try {
    const SQL = `
    SELECT *
    FROM project
    WHERE project_id = ?
    `;

    const [project]: any = await db.query(SQL, [project_id]);

    const isProjectValid = project[0].project_id;

    if (!isProjectValid) AppErrors.handleNotFound('이미 삭제된 모집 글 입니다.');
  } catch (error) {
    console.log(error);
    throw error;
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

    const isProjectValid = project[0].project_id;

    if (!isProjectValid) AppErrors.handleNotFound('이미 삭제된 모집 글 입니다.');

    return project[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 마이페이지 작성 모집 글 목록 조회 */
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
    throw error;
  }
};

/* 마이페이지 북마크 모집 글 목록 조회 */
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
    WHERE bookmark.user_id = ?
    GROUP BY project.project_id
    `;

    const [projects]: any = await db.query(SQL, [user_id, user_id]);

    return projects;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 모집 글에 조회한 유저의 조회 날짜가 현재인지 조회 */
export const findUserViewDateById = async (
  user_id: number,
  project_id: number,
  currentDate: string
): Promise<any> => {
  try {
    const SQL = `
    SELECT COUNT(*) AS project_view_count
    FROM project_view
    WHERE user_id = ? AND project_id = ? AND project_view_date = ?
    `;

    const [date]: any = await db.query(SQL, [user_id, project_id, currentDate]);

    return Number(date[0].project_view_count);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* 모집 글 클릭 시 조회 수 증가 */
export const updateProjectViewsCount = async (
  user_id: number,
  project_id: number,
  currentDate: string
): Promise<any> => {
  try {
    const SQL1 = `
    UPDATE project
    SET project_views_count = project_views_count + 1
    WHERE project_id = ?
    `;

    await db.execute(SQL1, [project_id]);

    const SQL2 = `
    INSERT INTO project_view (user_id, project_id, project_view_date)
    VALUES (?, ?, ?)
    `;

    await db.execute(SQL2, [user_id, project_id, currentDate]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
