import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as bookmarkPortfolioService from '../services/bookmarkPortfolioService';
import * as BookmarkPortfolio from '../types/BookmarkPortfolioType';
