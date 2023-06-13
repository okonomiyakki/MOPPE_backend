import jwt from 'jsonwebtoken';
import env from '../config/envconfig';
import * as User from '../types/UserType';

export const login = async (
  foundUserInfoWithPayload: User.InfoWithPayload
): Promise<User.InfoWithTokens> => {
  const payload: User.Payload = {
    user_id: foundUserInfoWithPayload.user_id,
    user_email: foundUserInfoWithPayload.user_email,
  };

  const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_ACCESS_TOKEN_SECRET';

  const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'MOGAKPPO_REFRESH_TOKEN_SECRET';

  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });

  const userInfo: User.Info = {
    user_id: foundUserInfoWithPayload.user_id,
    user_name: foundUserInfoWithPayload.user_name,
    user_img: foundUserInfoWithPayload.user_img,
    user_career_goal: foundUserInfoWithPayload.user_career_goal,
    user_stacks: foundUserInfoWithPayload.user_stacks,
    user_introduction: foundUserInfoWithPayload.user_introduction,
  };

  const userInfoWithTokens: User.InfoWithTokens = {
    accessToken,
    refreshToken,
    ...userInfo,
  };

  return userInfoWithTokens;
};
