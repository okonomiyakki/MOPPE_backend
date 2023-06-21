import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/RequestType';
import { validateDto } from '../../utils/dtoValidator';
import env from '../../config/envconfig';
import * as AppErrors from '../../middlewares/errorHandler';
import * as Portfolio from '../../database/dtos/portfolioDto';

export const addPortfolioValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const {
      portfolio_title,
      portfolio_summary,
      portfolio_github,
      portfolio_stacks,
      portfolio_description,
      memberIds,
      project_id,
    } = req.body;
    const fileList = req.files as any[];

    if (Number(project_id) === 0) {
      delete req.body.project_id;
    }

    if (fileList.length > 0) {
      const imgFileRoots = fileList.map(
        (file) => `${env.UPLOAD_IMAGE_FILE_ROOT}/portfolio/${file.filename}`
      );

      req.body.portfolio_thumbnail = imgFileRoots[0];
      req.body.portfolio_img = imgFileRoots.slice(1);
    }

    if (fileList.length === 0) req.body.portfolio_img = [];

    const addPortfolio = new Portfolio.AddPortfolioDto(
      user_id,
      Number(project_id),
      portfolio_title,
      portfolio_summary,
      portfolio_github,
      JSON.parse(portfolio_stacks),
      portfolio_description,
      JSON.parse(memberIds),
      fileList
    );

    validateDto(addPortfolio, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const editPortfolioValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.params;
    const {
      portfolio_title,
      portfolio_summary,
      portfolio_github,
      portfolio_stacks,
      portfolio_description,
      memberIds,
      project_id,
    } = req.body;
    const fileList = req.files as any[];

    if (portfolio_title === undefined) {
      delete req.body.portfolio_title;
    }
    if (portfolio_summary === undefined) {
      delete req.body.portfolio_summary;
    }
    if (portfolio_github === undefined) {
      delete req.body.portfolio_github;
    }

    if (portfolio_description === undefined) {
      delete req.body.portfolio_description;
    }

    if (Number(project_id) === 0) {
      delete req.body.project_id;
    }

    if (fileList.length > 0) {
      const thumbnailImgFileRoots = fileList
        .filter((file) => file.filename.split('-')[0] === 'thumbnail')
        .map((file) => `${env.UPLOAD_IMAGE_FILE_ROOT}/portfolio/${file.filename}`);

      const editorImgFileRoots = fileList
        .filter((file) => file.filename.split('-')[0] !== 'thumbnail')
        .map((file) => `${env.UPLOAD_IMAGE_FILE_ROOT}/portfolio/${file.filename}`);

      if (thumbnailImgFileRoots.length === 0) delete req.body.portfolio_thumbnail;
      else req.body.portfolio_thumbnail = thumbnailImgFileRoots[0];

      req.body.portfolio_img = editorImgFileRoots;
    }

    if (fileList.length === 0) req.body.portfolio_img = [];

    const editPortfolio = new Portfolio.EditPortfolioDto(
      user_id,
      Number(portfolio_id),
      Number(project_id),
      JSON.parse(portfolio_stacks),
      JSON.parse(memberIds),
      portfolio_title,
      portfolio_summary,
      portfolio_github,
      portfolio_description,
      fileList
    );

    validateDto(editPortfolio, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const removePortfolioValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.params;

    const removePortfolio = new Portfolio.RemovePortfolioDto(user_id, Number(portfolio_id));

    validateDto(removePortfolio, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const getAllPortfoliosValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { keyword, sort, page } = req.query;

    const getAllPortfolios = new Portfolio.GetAllPortfoliosDto(
      user_id,
      keyword as string,
      sort as string,
      Number(page)
    );

    validateDto(getAllPortfolios, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const getPortfolioByIdValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { portfolio_id } = req.params;

    const getPortfolio = new Portfolio.GetPortfolioByIdDto(user_id, Number(portfolio_id));

    validateDto(getPortfolio, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const getUserPortfoliosByIdValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const my_user_id = req.user.user_id;
    const { page } = req.query;
    const { user_id } = req.params;

    const getUserPortfoliosById = new Portfolio.GetUserPortfoliosByIdDto(
      my_user_id,
      Number(page),
      Number(user_id)
    );

    validateDto(getUserPortfoliosById, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const getMyPortfoliosValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user;
    const { page } = req.query;

    if (user_id === 0)
      next(AppErrors.handleForbidden('잘못된 접근입니다. 회원가입 및 로그인 후 이용해 주세요.'));

    const GetUserPortfolios = new Portfolio.GetMyPortfoliosDto(user_id, Number(page));

    validateDto(GetUserPortfolios, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};

export const getPortfolioCommentsByIdValidateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { portfolio_id } = req.params;
    const { page } = req.query;

    const GetMyPortfolioCommentsById = new Portfolio.GetMyPortfolioCommentsByIdDto(
      Number(portfolio_id),
      Number(page)
    );

    validateDto(GetMyPortfolioCommentsById, next);
  } catch (error) {
    console.log(error);
    next(AppErrors.handleInternalServerError());
  }
};
