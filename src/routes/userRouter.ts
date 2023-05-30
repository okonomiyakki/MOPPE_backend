import { Router } from 'express';
import { signUpUserHandler, logInUserHandler } from '../controllers/userController';

const userRouter = Router();

/* 회원 가입 */
userRouter.post('/signup', signUpUserHandler);

/* 로그인 */
userRouter.post('/login', logInUserHandler);

export default userRouter;
