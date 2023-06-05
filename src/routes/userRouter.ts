import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import {
  signUpUserHandler,
  logInUserHandler,
  logOutUserHandler,
  editUserInfoHandler,
  getUserInfoByIdHandler,
} from '../controllers/userController';

const userRouter = Router();

/* 회원 가입 */
userRouter.post('/signup', signUpUserHandler);

/* 로그인 */
userRouter.post('/login', logInUserHandler);

/* 로그아웃 */
userRouter.post('/logout', logOutUserHandler);

/* 회원 상세 정보 수정 */
userRouter.patch('/profile', AuthenticateHandler, editUserInfoHandler);

/* 회원 마이페이지 상세 정보 조회 */
userRouter.get('/profile', AuthenticateHandler, getUserInfoByIdHandler);

export default userRouter;
