import multer from 'multer';
import fs from 'fs';
import { Response, NextFunction } from 'express';
import * as AppErrors from './errorHandler';
import { AuthRequest } from '../types/RequestType';
import { generateNewDate } from '../utils/dateGenerator';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

if (!fs.existsSync('public/user')) {
  fs.mkdirSync('public/user');
}

if (!fs.existsSync('public/project')) {
  fs.mkdirSync('public/project');
}

if (!fs.existsSync('public/portfolio')) {
  fs.mkdirSync('public/portfolio');
}

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/user/');
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/project/');
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const portfolioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/portfolio/');
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadUser = multer({ storage: userStorage });

const uploadProject = multer({ storage: projectStorage });

const uploadPortfolio = multer({ storage: portfolioStorage });

export const userProfileImageHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    uploadUser.single('user_img')(req, res, (error) => {
      if (error) {
        console.log(error);
        next(AppErrors.handleBadRequest('프로필 업로드 중 오류가 발생했습니다.'));
        console.log('user_img > ', req.files);
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const projectImageHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    uploadProject.array('project_img')(req, res, (error) => {
      if (error) {
        console.log(error);
        next(AppErrors.handleBadRequest('프로젝트 이미지 업로드 중 오류가 발생했습니다.'));
      }
      console.log('project_img > ', req.files);
      next();
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const portfolioImageHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // uploadPortfolio.single('portfolio_thumbnail')(req, res, (error) => {
    //   if (error) {
    //     console.log(error);
    //     next(AppErrors.handleBadRequest('썸네일 업로드 중 오류가 발생했습니다.'));
    //   }
    //   next();
    //   console.log('portfolio_thumbnail > ', req.files);
    // });
    uploadPortfolio.array('portfolio_img')(req, res, (error) => {
      if (error) {
        console.log(error);
        next(AppErrors.handleBadRequest('포트폴리오 이미지 업로드 중 오류가 발생했습니다.'));
      }
      next();
      console.log('portfolio_img > ', req.files);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// export const userProfileImageHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
//   uploadUser.single('user_img')(req, res, (error) => {
//     try {
//       console.log(1);
//       console.log(req.file);
//       next();
//     } catch (error) {
//       console.log(error);
//       next(AppErrors.handleBadRequest('이미지 업로드 중 오류가 발생했습니다.'));
//     }
//   });
// };

// export const projectImageHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     uploadProject.array('project_img')(req, res, (error) => {
//       if (error) {
//         console.log(error);
//         next(AppErrors.handleBadRequest('이미지 업로드 중 오류가 발생했습니다.'));
//       } else if (!req.files) return next();
//       else {
//         const fileUrls = (req.files as any[]).map(
//           (file) => `http://localhost:5500/api/v1/static/project/${file.filename}`
//         );
//         console.log('fileUrls : ', fileUrls);

//         res.status(200).json({ data: { fileUrls } });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
