import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validate, validateOrReject, ValidationError } from 'class-validator';
import * as AppErrors from '../../middlewares/errorHandler';
import * as User from '../../database/dtos/userDto';

export const signUpUserValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userSignUp = new User.SignUpDto(
      req.body.user_email,
      req.body.user_name,
      req.body.user_password
    );

    await validateOrReject(userSignUp)
      .then(next)
      .catch((errors: ValidationError[]) => {
        const errorMessage = errors
          .map((error) => (error.constraints ? Object.values(error.constraints).join(' ') : ''))
          .join(' & ');

        next(AppErrors.handleBadRequest(errorMessage));
      });
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const logInUserValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userLogIn = new User.LogInDto(req.body.user_email, req.body.user_password);
    console.log(userLogIn);
    await validateOrReject(userLogIn)
      .then(next)
      .catch((errors: ValidationError[]) => {
        console.log(errors);
        const errorMessage = errors
          .map((error) => (error.constraints ? Object.values(error.constraints).join(' ') : ''))
          .join(' & ');

        next(AppErrors.handleBadRequest(errorMessage));
      });
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
