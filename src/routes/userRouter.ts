import { Router } from 'express';
import {
  signUpUserHandler,
  logInUserHandler,
  logOutUserHandler,
  getUserInfoByIdHandler,
} from '../controllers/userController';
import AuthenticateHandler from '../middlewares/authHandler';

const userRouter = Router();

/* 회원 가입 */
userRouter.post('/signup', signUpUserHandler);

/* 로그인 */
userRouter.post('/login', logInUserHandler);

/* 로그아웃 */
userRouter.post('/logout', logOutUserHandler);

/* 회원 마이페이지 상세 정보 조회 */
userRouter.get('/profile', AuthenticateHandler, getUserInfoByIdHandler);

export default userRouter;
