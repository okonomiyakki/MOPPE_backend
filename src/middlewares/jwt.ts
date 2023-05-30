import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { PayloadInfo } from '../database/types/User';
import jwt from 'jsonwebtoken';
import env from '../config/envconfig';

interface RequestWithToken extends Request {
  user: PayloadInfo;
}

const tokenHandler = async (req: RequestWithToken, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers['authorization'];

    const accessToken = authorization && authorization.split(' ')[1];

    if (!accessToken) throw new AppError(401, '[ 접근 불가 ] 올바른 토큰을 제시해 주세요.');

    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'MOGAKPPO_DEFAULT_ACCESS_TOKEN_SECRET';

    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'MOGAKPPO_DEFAULT_REFRESH_TOKEN_SECRET';

    const decodedAccessToken = jwt.verify(accessToken, accessTokenSecret) as PayloadInfo;

    req.user = decodedAccessToken;

    next();
  } catch (error) {
    console.log(error);
  }
};
