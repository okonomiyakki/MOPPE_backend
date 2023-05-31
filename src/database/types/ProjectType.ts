interface ProjectProfile {
  project_id: number;
  user_id: number;
  project_type: string;
  project_recruitment_status: string;
  project_title: string;
  project_summary: string;
  project_recruitment_role: { roleList: string[] };
  project_required_stacks: { stackList: string[] } | null;
  project_goal: string;
  project_participation_time: string;
  project_introduction: string;
  project_img: string | null;
  project_views: number;
  project_created_at: string;
}

export type CreateProjectInput = Pick<
  ProjectProfile,
  | 'user_id'
  | 'project_type'
  | 'project_title'
  | 'project_summary'
  | 'project_recruitment_role'
  | 'project_required_stacks'
  | 'project_goal'
  | 'project_participation_time'
  | 'project_introduction'
  | 'project_img'
>;
