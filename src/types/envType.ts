interface EnvType {
  BCRYPT_SALT_ROUNDS: string | undefined;

  HOST: string | undefined;
  PORT: string | undefined;

  DB_HOST: string | undefined;
  DB_PORT: string | undefined;
  DB_NAME: string | undefined;
  DB_USERNAME: string | undefined;
  DB_PASSWORD: string | undefined;

  JWT_SECRET_KEY_LENGTH: string | undefined;

  ACCESS_TOKEN_SECRET: string | undefined;
  ACCESS_TOKEN_EXPIRES_IN: string | undefined;

  REFRESH_TOKEN_SECRET: string | undefined;
  REFRESH_TOKEN_EXPIRES_IN: string | undefined;

  UPLOAD_IMAGE_FILE_ROOT: string | undefined;

  KAKAO_LOGIN_API_CLIENT_ID: string | undefined;
  KAKAO_LOGIN_API_REDIRECT_URI: string | undefined;
}

export type EnvConfig = EnvType;
