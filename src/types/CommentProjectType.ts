interface CommentProfile {
  comment_id: number;
  project_id: number;
  user_id: number;
  comment_content: string;
  comment_created_at: string;
}

export type CreateCommentInput = Pick<CommentProfile, 'user_id' | 'project_id' | 'comment_content'>;

export type UpdateCommentInput = Partial<Pick<CommentProfile, 'comment_content'>>;

export type Id = number;
