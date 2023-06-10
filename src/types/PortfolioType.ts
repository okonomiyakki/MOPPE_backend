interface PortfolioProfile {
  portfolio_id: number;
  user_id: number;
  portfolio_title: string;
  portfolio_summary: string;
  portfolio_thumbnail: string;
  portfolio_github: string;
  portfolio_stacks: { stackList: string[] };
  portfolio_description: string;
  portfolio_img: { imgList: string[] } | null;
  portfolio_views_count: number;
  portfolio_created_at: string;
}

export type CreateInput = Pick<
  PortfolioProfile,
  | 'user_id'
  | 'portfolio_title'
  | 'portfolio_summary'
  | 'portfolio_thumbnail'
  | 'portfolio_github'
  | 'portfolio_stacks'
  | 'portfolio_description'
  | 'portfolio_img'
>;

export type UpdateInput = Partial<
  Pick<
    PortfolioProfile,
    | 'portfolio_title'
    | 'portfolio_summary'
    | 'portfolio_thumbnail'
    | 'portfolio_github'
    | 'portfolio_stacks'
    | 'portfolio_description'
    | 'portfolio_img'
  >
>;

export type QueryInput = {
  portfolio_keyword?: string;
  page: number;
};

export type Id = number;
