interface CommentPortfolioProfile {
  comment_id: number;
  portfolio_id: number;
  user_id: number;
  comment_content: string;
  comment_created_at: string;
}

export type CreateCommentInput = Pick<
  CommentPortfolioProfile,
  'user_id' | 'portfolio_id' | 'comment_content'
>;

export type UpdateCommentInput = Partial<Pick<CommentPortfolioProfile, 'comment_content'>>;

export type Id = number;
