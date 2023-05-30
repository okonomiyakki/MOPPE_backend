interface UserProfile {
  user_id: number;
  user_email: string;
  user_name: string;
  user_password: string;
  user_career_goal: string;
  user_stacks: string;
  user_introduction: string;
  user_img: string;
  user_created_at: string;
}

export type signUpUserInput = Pick<UserProfile, 'user_email' | 'user_name' | 'user_password'>;

export type logInUserInput = Pick<UserProfile, 'user_email' | 'user_password'>;

export type updatUserInput = Partial<
  Pick<
    UserProfile,
    'user_name' | 'user_career_goal' | 'user_stacks' | 'user_introduction' | 'user_img'
  >
>;
