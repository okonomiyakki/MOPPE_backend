import { Query } from 'typeorm/driver/Query';
import * as B from './BookmarkType';
interface ProjectProfile {
  project_id: number;
  user_id: number;
  project_type: string;
  project_recruitment_status: string;
  project_title: string;
  project_summary: string;
  project_recruitment_roles: { roleList: string[] };
  project_required_stacks: { stackList: string[] } | null;
  project_goal: string;
  project_participation_time: string;
  project_introduction: string;
  project_img: string | null;
  project_views_count: number;
  project_created_at: string;
}

export type CreateProjectInput = Pick<
  ProjectProfile,
  | 'user_id'
  | 'project_type'
  | 'project_title'
  | 'project_summary'
  | 'project_recruitment_roles'
  | 'project_required_stacks'
  | 'project_goal'
  | 'project_participation_time'
  | 'project_introduction'
  | 'project_img'
>;

export type UpdateInput = Partial<
  Pick<
    ProjectProfile,
    | 'project_type'
    | 'project_title'
    | 'project_summary'
    | 'project_recruitment_roles'
    | 'project_required_stacks'
    | 'project_goal'
    | 'project_participation_time'
    | 'project_introduction'
    | 'project_img'
  >
>;

export type QueryInput = {
  project_role?: string;
  project_status?: string;
  project_keyword?: string;
  page: number;
};

export type ListByRole = Pick<
  ProjectProfile,
  | 'project_id'
  | 'project_type'
  | 'project_recruitment_status'
  | 'project_title'
  | 'project_summary'
  | 'project_recruitment_roles'
  | 'project_required_stacks'
  | 'project_goal'
  | 'project_participation_time'
  | 'project_views_count'
  | 'project_created_at'
> & {
  project_bookmark_count: number;
  project_comments_count: number;
};

export type Id = number;
