import express from 'express';

const staticRouter = express.Router();

const userStaticRouter = express.static('public/user');

const projectStaticRouter = express.static('public/project');

const portfolioStaticRouter = express.static('public/portfolio');

staticRouter.use('/user', userStaticRouter);

staticRouter.use('/project', projectStaticRouter);

staticRouter.use('/portfolio', portfolioStaticRouter);

export default staticRouter;
