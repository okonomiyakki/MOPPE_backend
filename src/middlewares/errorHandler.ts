import { Request, Response, NextFunction } from 'express';
// import AppError from '../types/AppErrorType';

class AppError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: 'Error',
    statusCode: statusCode || 500,
    message: message || '서버에서 에러가 발생했습니다.',
  });
};

export const handleBadRequest = (message: string = '잘못된 요청입니다.') => {
  throw new AppError(400, message);
};

export const handleInternalServerError = (message: string = '내부 서버 오류가 발생했습니다.') => {
  throw new AppError(500, message);
};

export const handleNotFound = (message: string = '찾을 수 없습니다.') => {
  throw new AppError(404, message);
};

export const handleForbidden = (message: string = '접근이 거부되었습니다.') => {
  throw new AppError(403, message);
};

export const handleUnauthorized = (message: string = '인증되지 않았습니다.') => {
  throw new AppError(401, message);
};

export { AppError };
