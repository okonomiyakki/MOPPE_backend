import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';

export const validateProjectInputHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {};
