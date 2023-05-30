import { Router } from 'express';
import { signUpUserHandler } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/signup', signUpUserHandler);

export default userRouter;
