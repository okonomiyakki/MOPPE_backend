import { Router } from 'express';
import { getAllStacksHandler } from '../controllers/stackController';

const stackRouter = Router();

/* 전체 기술 스택 리스트 조회 */
stackRouter.get('/', getAllStacksHandler);

export default stackRouter;
