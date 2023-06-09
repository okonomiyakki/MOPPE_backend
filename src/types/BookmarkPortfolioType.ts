interface BookmarkPortfolioProfile {
  bookmark_id: number;
  portfolio_id: number;
  user_id: number;
}

export type CreateInput = Pick<BookmarkPortfolioProfile, 'portfolio_id' | 'user_id'>;

export type BookmarkedProjects = Pick<BookmarkPortfolioProfile, 'portfolio_id'>;

export type BookmarkedProjectIds = number;

export type Id = number;
