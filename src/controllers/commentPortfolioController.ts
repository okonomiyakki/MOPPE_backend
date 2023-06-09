import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/RequestType';
import AppError from '../types/AppErrorType';
import * as AppErrors from '../middlewares/errorHandler';
import * as commentPortfolioService from '../services/commentPortfolioService';
import * as CommentPortfolio from '../types/CommentPortfolioType';
