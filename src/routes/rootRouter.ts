import { Router, Request, Response } from 'express';

const rootRouter = Router();

rootRouter.get('/', (req: Request, res: Response) => {
  res.send('This is "Team07" root page');
});

export default rootRouter;
