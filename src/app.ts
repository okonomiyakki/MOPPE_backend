import express from 'express';
import env from './config/envconfig';
import db from './config/dbconfig';
import router from './routes';
import { errorHandlerMiddleware } from './utils/errorHandler';

const app = express();
const port = Number(env.PORT || 3000);

app.use(express.json()); // json 파싱

app.use('/api', router);
app.use(errorHandlerMiddleware);

db.getConnection()
  .then(async () => {
    console.log('✅ AWS RDS 접속 성공');

    app.listen(port, () => {
      console.log('DB_HOST:', env.DB_HOST);
      console.log('DB_NAME:', env.DB_NAME);
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log('⛔ AWS RDS 접속 및 서버 실행 실패', error));
