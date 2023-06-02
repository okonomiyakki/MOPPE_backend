import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/envconfig';
import db from './config/dbconfig';
import router from './routes';
import { errorHandlerMiddleware } from './middlewares/errorHandler';

const app = express();
const port = Number(env.PORT || 3000);
const allowedOrigin = env.HOST;

const corsOptions = {
  origin: allowedOrigin,
  credentials: true, // 쿠키 허용
  exposedHeaders: ['Authorization'], // 헤더 허용
};

app.use(cors(corsOptions));
app.use(cookieParser()); // 쿠키 파싱
app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: true })); // 폼데이터 파싱

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
