import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { PayloadInfo } from '../database/types/UserType';
import { AuthRequest } from '../database/types/RequestType';
import jwt from 'jsonwebtoken';
import env from '../config/envconfig';

const AuthenticateHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers['authorization'];

    const accessToken = authorization && authorization.split(' ')[1]; // 유저 엑세스 토큰

    if (!accessToken) throw new AppError(403, '[ 접근 불가 ] AccessToken을 제시해 주세요.');

    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_ACCESS_TOKEN_SECRET';

    const decodedAccessToken = jwt.verify(accessToken, accessTokenSecret) as PayloadInfo;

    req.user = decodedAccessToken;

    next();
  } catch (accessTokenError: any) {
    /* 엑세스 토큰 만료 */
    if (accessTokenError.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken; // 유저 리프레시 토큰

      if (!refreshToken) throw new AppError(403, '[ 접근 불가 ] RefreshToken을 제시해 주세요.');

      try {
        const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_ACCESS_TOKEN_SECRET';

        const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'MOGAKPPO_REFRESH_TOKEN_SECRET';

        const decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret) as PayloadInfo;

        const accessToken = jwt.sign({ user_id: decodedRefreshToken.user_id }, accessTokenSecret, {
          expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
        });

        res.setHeader('Authorization', `Bearer ${accessToken}`); // 엑세스 토큰 재발급

        next();
      } catch (RefreshTokenError: any) {
        if (RefreshTokenError.name === 'TokenExpiredError') {
          res.clearCookie('refreshToken'); // refresh token 이 만료된 경우

          throw new AppError(
            401,
            '[ 접근 불가 ] RefreshToken이 만료되었습니다. 로그인을 다시 해주세요.'
          );
        }
        throw new AppError(
          403,
          '[ 접근 불가 ] RefreshToken이 유효하지 않습니다. 토큰을 확인해주세요.'
        );
      }
    }
  }
};

export default AuthenticateHandler;
