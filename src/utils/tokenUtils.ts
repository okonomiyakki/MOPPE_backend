import jwt from 'jsonwebtoken';
import env from '../config/envconfig';
import { AppError } from '../middlewares/errorHandler';
import * as U from '../types/UserType';

export const verifyAccessToken = (accessToken: any) => {
  try {
    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_ACCESS_TOKEN_SECRET';

    const decodedAccessToken = jwt.verify(accessToken, accessTokenSecret) as U.decodedToken;

    return decodedAccessToken;
  } catch (error) {
    console.log(error);
    throw new AppError(401, 'AccessToken이 유효하지 않습니다.');
  }
};

export const verifyRefreshToken = (refreshToken: any) => {
  try {
    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'MOGAKPPO_REFRESH_TOKEN_SECRET';

    const decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret) as U.decodedToken;

    return decodedRefreshToken;
  } catch (error) {
    console.log(error);
    throw new AppError(401, 'RefreshToken이 유효하지 않습니다.');
  }
};

export const generateNewAccessToken = (decodedRefreshToken: U.decodedToken) => {
  const newPayload: U.PayloadInfo = {
    user_id: decodedRefreshToken.user_id,
    user_email: decodedRefreshToken.user_email,
  };

  const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_ACCESS_TOKEN_SECRET';

  const newAccessToken = jwt.sign(newPayload, accessTokenSecret, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });

  const newAccessTokenInfo = {
    newAccessToken,
  };
  return newAccessTokenInfo;
};
