interface UserProfile {
  user_id: number;
  user_email: string;
  user_name: string;
  user_password: string;
  user_career_goal: string | null;
  user_stacks: string | null;
  user_introduction: string | null;
  user_img: string | null;
  user_created_at: string;
}

export type SignUpUserInput = Pick<UserProfile, 'user_email' | 'user_name' | 'user_password'>;

export type LogInUserInput = Pick<UserProfile, 'user_email' | 'user_password'>;

export type UpdatUserInput = Partial<
  Pick<
    UserProfile,
    'user_name' | 'user_career_goal' | 'user_stacks' | 'user_introduction' | 'user_img'
  >
>;

export type foundUser = Pick<UserProfile, 'user_id' | 'user_email' | 'user_name' | 'user_password'>;

export type PayloadInfo = Pick<UserProfile, 'user_id' | 'user_email' | 'user_password'>;

export type TokenInfo = {
  accessToken: string;
  refreshToken: string;
};
