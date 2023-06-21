interface CommentProjectProfile {
  comment_id: number;
  project_id: number;
  user_id: number;
  parent_id: number;
  comment_content: string;
  comment_created_at: string;
  replies?: CommentProjectProfile[];
}

export type CreateCommentInput = Pick<
  CommentProjectProfile,
  'user_id' | 'project_id' | 'comment_content' | 'parent_id'
>;

export type UpdateCommentInput = Partial<Pick<CommentProjectProfile, 'comment_content'>>;

export type Id = number;

export type sortForReplies = {
  comment_id: number;
  parent_id: number;
  user_id: number;
  user_name: string;
  user_img: string;
  comment_content: string;
  comment_created_at: string;
  replies?: sortForReplies[];
};
