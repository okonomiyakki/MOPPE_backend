import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/envconfig';
import db from './config/dbconfig';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const port = Number(env.PORT || 3000);
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://34.64.242.119',
  'http://34.64.242.119:80',
  'https://34.64.242.119',
  'https://34.64.242.119:80',
  'https://34.64.242.119:3000',
  'http://kdt-sw-4-team07.elicecoding.com',
  'http://kdt-sw-4-team07.elicecoding.com:80',
  'http://kdt-sw-4-team07.elicecoding.com:3000',
  'http://kdt-sw-4-team07.elicecoding.com:5000',
  'http://192.168.200.104:3000',
  'http://192.168.0.15:3000',
  'http://192.168.123.141:3000',
  'http://192.168.0.5:3000',
  'http://172.30.1.42:3000',
  'http://192.168.0.64:3000',
  'http://192.168.0.*:3000',
  'http://13.209.192.1',
  'https://13.209.192.1',
  'http://moppe.co.kr',
  'https://moppe.co.kr',
];

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
