interface CommentProjectProfile {
  comment_id: number;
  project_id: number;
  user_id: number;
  comment_content: string;
  comment_created_at: string;
}

export type CreateCommentInput = Pick<
  CommentProjectProfile,
  'user_id' | 'project_id' | 'comment_content'
>;

export type UpdateCommentInput = Partial<Pick<CommentProjectProfile, 'comment_content'>>;

export type Id = number;
