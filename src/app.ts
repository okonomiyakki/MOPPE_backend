import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/envconfig';
import db from './config/dbconfig';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const port = Number(env.PORT || 3000);
const allowedOrigins = ['http://localhost:3000', 'https://moppe.co.kr'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // 쿠키 허용
  exposedHeaders: ['Authorization'], // 헤더 허용
};

app.use(cors(corsOptions));
app.use(cookieParser()); // 쿠키 파싱
app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: true })); // 폼데이터 파싱

app.use('/api', router);
app.use(errorHandler);

db.getConnection()
  .then(async () => {
    console.log('✅ GCP MySQL 접속 성공');

    app.listen(port, () => {
      console.log('DB_HOST:', env.DB_HOST);
      console.log('DB_NAME:', env.DB_NAME);
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log('⛔ GCP MySQL 접속 및 서버 실행 실패', error));
