import { Router, Request, Response } from 'express';

const rootRouter = Router();

rootRouter.get('/', (req: Request, res: Response) => {
  res.send(`This is __mogakppo__ root page`);
});

export default rootRouter;
