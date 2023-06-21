import { Router } from 'express';
import AuthenticateHandler from '../middlewares/authHandler';
import * as userValidator from '../middlewares/validationHandler/userValidator';
import * as upload from '../middlewares/imageHandler';
import * as userController from '../controllers/userController';

const userRouter = Router();

/* 회원 가입 */
userRouter.post(
  '/signup',
  userValidator.signUpUserValidateHandler,
  userController.signUpUserHandler
);

/* 로그인 */
userRouter.post('/login', userValidator.logInUserValidateHandler, userController.logInUserHandler);

/* 카카오 로그인 */
userRouter.get('/kakao', userController.kakaoLoginHandler);

/* 로그아웃 */
userRouter.post('/logout', userController.logOutUserHandler);

/* 회원 비밀번호 수정 */
userRouter.patch(
  '/password',
  AuthenticateHandler,
  userValidator.editUserPassWordValidateHandler,
  userController.editUserPassWordHandler
);

/* 회원 상세 정보 수정 */
userRouter.patch(
  '/profile',
  AuthenticateHandler,
  upload.userProfileImageHandler,
  userValidator.editUserInfoValidateHandler,
  userController.editUserInfoHandler
);

/* 회원 탈퇴 */
userRouter.delete(
  '/withdrawal',
  AuthenticateHandler,
  userValidator.removeUserValidateHandler,
  userController.removeUserHandler
);

/* 다른 회원 마이페이지 상세 정보 조회 */
userRouter.get(
  '/profile/:user_id',
  AuthenticateHandler,
  userValidator.getMemberInfoValidateHandler,
  userController.getMemberInfoByIdHandler
);

/* 회원 마이페이지 상세 정보 조회 */
userRouter.get(
  '/profile',
  AuthenticateHandler,
  userValidator.getMyInfoValidateHandler,
  userController.getMyInfoByIdHandler
);

/* 키워드 별 회원 검색 */
userRouter.get(
  '/members',
  AuthenticateHandler,
  userValidator.getMembersValidateHandler,
  userController.getMembersBykeywordHandler
);

export default userRouter;
