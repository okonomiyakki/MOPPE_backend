import crypto from 'crypto';
import env from '../config/envconfig';

const generateRandomKey = (length: number) => {
  return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateRandomKey(Number(env.JWT_SECRET_KEY_LENGTH));
console.log('Secret Key:', secretKey);
