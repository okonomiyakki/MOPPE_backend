interface MemberProfile {
  member_id: number;
  portfolio_id: number;
  user_id: number;
}

export type CreateInput = Pick<MemberProfile, 'user_id' | 'portfolio_id'>;

export type Id = number;
