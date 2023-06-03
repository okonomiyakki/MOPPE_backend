import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import { AppError } from './errorHandler';
import { verifyAccessToken, verifyRefreshToken, generateNewAccessToken } from '../utils/tokenUtils';

const nextForGuest = (req: AuthRequest, res: Response, next: NextFunction) => {
  req.user = {
    user_id: 0,
    user_email: 'GUEST@gmail.com',
  };
  return next();
};

/* jwt 미들웨어 수정본 - 23/06/03 */
const AuthenticateHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // const authcookie = req.cookies.Authorization;
    const authHeader = req.headers['authorization'];
    // const refreshToken = req.cookies.RT;
    // console.log('refreshToken : ', refreshToken);

    const accessToken = authHeader && authHeader.split('Bearer ')[1];
    console.log('accessToken : ', accessToken);

    if (accessToken === undefined && req.method === 'GET') return nextForGuest(req, res, next);

    if (accessToken === undefined) throw new AppError(401, 'AccessToken을 제시해 주세요.');

    /* AccessToken 검증 */
    const decodedAccessToken = verifyAccessToken(accessToken);

    /* AccessToken이 유효하면 */
    if (decodedAccessToken) {
      const currentTime = Math.floor(Date.now() / 1000);

      /* AccessToken 만료시간 검사 */
      if (decodedAccessToken.exp > currentTime) {
        req.user = decodedAccessToken;

        /* AccessToken이 만료되지 않았으면 바로 통과 */
        next();
      } else {
        /* AccessToken이 만료되었으면 RefreshToken 추출 */
        const refreshToken = req.cookies.RT;

        if (refreshToken === undefined)
          throw new AppError(401, 'RefreshToken이 존재하지 않습니다. 다시 로그인해 주세요.');

        /* RefreshToken 검증 */
        const decodedRefreshToken = verifyRefreshToken(refreshToken);

        /* RefreshToken이 유효하면 */
        if (decodedRefreshToken) {
          const currentTime = Math.floor(Date.now() / 1000);

          /* RefreshToken 만료시간 검사 */
          if (decodedRefreshToken.exp > currentTime) {
            /* RefreshToken이 만료되지 않았으면  AccessToken 재발급*/
            const newAccessTokenInfo = generateNewAccessToken(decodedRefreshToken);

            /* 응답 바디로 AccessToken 재발급 */
            res.status(401).json({ message: 'accessToken 재발급', data: newAccessTokenInfo });
          } else {
            throw new AppError(401, 'RefreshToken이 만료되었습니다. 다시 로그인해 주세요.');
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 401) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ 접근 불가 ] 사용자 인증 실패'));
    }
  }
};

export default AuthenticateHandler;
