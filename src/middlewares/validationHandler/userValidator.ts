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
    const signupUser = new User.SignUpDto(
      req.body.user_email,
      req.body.user_name,
      req.body.user_password
    );

    await validateOrReject(signupUser)
      .then(next)
      .catch((errors: ValidationError[]) => {
        const errorMessage = errors
          .map((error) => (error.constraints ? Object.values(error.constraints).join(' ') : ''))
          .join(' & ');

        next(AppErrors.handleBadRequest(errorMessage));

        // const errors: ValidationError[] = await validate(signupUser, { skipMissingProperties: true });

        // if (errors.length > 0) {
        //   const errorMessage = errors[0].constraints
        //     ? Object.values(errors[0].constraints).join(' ')
        //     : '';
        //   next(AppErrors.handleBadRequest(errorMessage));
        // } else {
        //   next();
        // }

        // await validateOrReject(signupUser)
        //   .then(next)
        //   .catch((errors: ValidationError[]) => {
        //     console.log(errors);
        //     const errorMessages = errors.map((error) => {
        //       if (error.constraints) {
        //         return Object.values(error.constraints).join(' ');
        //       } else if (error.children && error.children.length > 0) {
        //         return error.children
        //           .map((childError) =>
        //             childError.constraints ? Object.values(childError.constraints) : ''
        //           )
        //           .join(', ');
        //       } else {
        //         return '';
        //       }
        //     });
        // const errorMessage = errorMessages.filter((message) => message !== '').join(', ');
      });
    next();
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
