import { Request } from 'express';
import { PayloadInfo } from './UserType';

declare global {
  namespace Express {
    interface Request {
      user: PayloadInfo;
    }
  }
}

export interface AuthRequest extends Request {}
