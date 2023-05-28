import express from 'express';
import { env } from './config/envconfig';
import { router } from './routes';

const port = Number(env.PORT || 3000);

const app = express();

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
