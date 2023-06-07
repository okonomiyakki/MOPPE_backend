import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import { AppError } from './errorHandler';
import multer from 'multer';
import fs from 'fs';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const processImageHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  upload.single('user_img')(req, res, (error) => {
    try {
      next();
    } catch (error) {
      console.log(error);
      next(new AppError(400, '이미지 업로드 중 오류가 발생했습니다.'));
    }
  });
};

export default processImageHandler;
