import { Router } from 'express';
import {
  signUpUserHandler,
  logInUserHandler,
  logOutUserHandler,
} from '../controllers/userController';
import AuthenticateHandler from '../middlewares/jwt';

const userRouter = Router();

/* 회원 가입 */
userRouter.post('/signup', signUpUserHandler);

/* 로그인 */
userRouter.post('/login', logInUserHandler);

/* 로그아웃 */
userRouter.post('/logout', AuthenticateHandler, logOutUserHandler);

export default userRouter;
