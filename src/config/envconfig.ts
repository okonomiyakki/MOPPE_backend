import dotenv from 'dotenv';

dotenv.config();

type EnvConfig = {
  BCRYPT_SALT_ROUNDS: string | undefined;
  HOST: string | undefined;
  PORT: string | undefined;
  DB_HOST: string | undefined;
  DB_PORT: string | undefined;
  DB_NAME: string | undefined;
  DB_USERNAME: string | undefined;
  DB_PASSWORD: string | undefined;
  ACCESS_TOKEN_SECRET: string | undefined;
  ACCESS_TOKEN_EXPIRES_IN: string | undefined;
  REFRESH_TOKEN_SECRET: string | undefined;
  REFRESH_TOKEN_EXPIRES_IN: string | undefined;
};

const env: EnvConfig = {
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,

  HOST: process.env.HOST,
  PORT: process.env.PORT,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
};

export default env;
