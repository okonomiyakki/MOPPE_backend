interface CompleteProjectProfile {
  project_complete_id: number;
  project_id: number;
  portfolio_id: number;
}

export type CreateInput = Pick<CompleteProjectProfile, 'project_id' | 'portfolio_id'>;

export type Id = number;
