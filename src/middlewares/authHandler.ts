import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import jwt from 'jsonwebtoken';
import env from '../config/envconfig';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as U from '../types/UserType';
import { generateNewAccessToken } from '../utils/AccessTokenGenerator';

const nextForGuest = (req: AuthRequest, next: NextFunction) => {
  req.user = {
    user_id: 0,
    user_email: 'GUEST@email.com',
  };
  return next();
};

const generateNewAccessTokenHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshHeader = req.header('X-Refresh-Token');

    const refreshToken = refreshHeader !== undefined ? refreshHeader : undefined;

    // const refreshToken = typeof refreshHeader !== 'string' ? refreshHeader[0] : refreshHeader;

    // const refreshToken = authHeader && authHeader.split(' ')[1].split('refreshToken=')[1];

    if (refreshToken === undefined)
      AppErrors.handleUnauthorized('AccessToken이 만료되었습니다. RefreshToken을 보내주세요.');

    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'MOGAKPPO_REFRESH_TOKEN_SECRET';

    /* RefreshToken 검증 */
    if (refreshToken) {
      const decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret) as U.decodedToken;

      const currentTime = Math.floor(Date.now() / 1000);

      /* RefreshToken 검증 완료 시 만료시간 검사*/
      if (decodedRefreshToken.exp >= currentTime) {
        const newAccessTokenInfo = generateNewAccessToken(decodedRefreshToken);

        /* 응답 바디로 AccessToken 재발급 */
        res.status(200).json({ message: 'generate new AccessToken', data: newAccessTokenInfo });
      }
    }
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else if (error.message === 'jwt expired')
      next(AppErrors.handleUnauthorized('RefreshToken이 만료되었습니다. 다시 로그인해 주세요.'));
    else if (error.message === 'jwt malformed')
      next(AppErrors.handleUnauthorized('RefreshToken이 유효하지 않습니다.'));
    else next(AppErrors.handleInternalServerError());
  }
};

/* jwt 미들웨어 수정본 - 23/06/04 01:00 */
const AuthenticateHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // const authcookie = req.cookies.Authorization;
    const authHeader = req.headers['authorization'];

    const accessToken = authHeader && authHeader.split('Bearer ')[1];

    /* 방문자 통과 */
    if (accessToken === undefined && req.method === 'GET') return nextForGuest(req, next);

    if (accessToken === undefined)
      AppErrors.handleUnauthorized('AccessToken이 존재하지 않습니다. 로그인 후 이용해 주세요.');

    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_ACCESS_TOKEN_SECRET';

    /* AccessToken 검증 */
    if (accessToken) {
      const decodedAccessToken = jwt.verify(accessToken, accessTokenSecret) as U.decodedToken;

      const currentTime = Math.floor(Date.now() / 1000);

      /* AccessToken 검증 완료 시 만료시간 검사 */
      if (decodedAccessToken.exp >= currentTime) {
        req.user = decodedAccessToken;

        /* AccessToken이 만료되지 않았으면 통과 */
        return next();
      }
    }
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else if (error.message === 'jwt expired')
      /* AccessToken 만료 시 재발급 함수 호출 */
      generateNewAccessTokenHandler(req, res, next);
    else if (error.message === 'jwt malformed')
      next(AppErrors.handleUnauthorized('AccessToken이 유효하지 않습니다.'));
  }
};

export default AuthenticateHandler;
