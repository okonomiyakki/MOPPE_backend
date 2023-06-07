import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import processImageHandler from '../middlewares/multer';
import * as userController from '../controllers/userController';

const userRouter = Router();

/* 회원 가입 */
userRouter.post('/signup', userController.signUpUserHandler);

/* 로그인 */
userRouter.post('/login', userController.logInUserHandler);

/* 로그아웃 */
userRouter.post('/logout', userController.logOutUserHandler);

/* 회원 상세 정보 수정 */
userRouter.patch(
  '/profile',
  AuthenticateHandler,
  processImageHandler,
  userController.editUserInfoHandler
);

/* 다른 회원 마이페이지 상세 정보 조회 */
userRouter.get('/profile/:user_id', AuthenticateHandler, userController.getUserInfoByIdHandler);

/* 회원 마이페이지 상세 정보 조회 */
userRouter.get('/profile', AuthenticateHandler, userController.getMyInfoByIdHandler);

export default userRouter;
