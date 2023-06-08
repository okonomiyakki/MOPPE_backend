import jwt from 'jsonwebtoken';
import env from '../config/envconfig';
import * as U from '../types/UserType';

export const generateNewAccessToken = (decodedRefreshToken: U.decodedToken) => {
  const newPayload: U.Payload = {
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
