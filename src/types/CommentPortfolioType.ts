interface CommentPortfolioProfile {
  comment_id: number;
  portfolio_id: number;
  user_id: number;
  comment_content: string;
  comment_created_at: string;
}

export type CreateInput = Pick<
  CommentPortfolioProfile,
  'user_id' | 'portfolio_id' | 'comment_content'
>;

export type UpdateInput = Partial<Pick<CommentPortfolioProfile, 'comment_content'>>;

export type Id = number;
