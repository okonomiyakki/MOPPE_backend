import env from '../config/envconfig';
import bcrypt from 'bcrypt';

/* 비밀번호 해싱 함수 */
const hashPassword = async (password: string) => {
  const saltRounds = Number(env.BCRYPT_SALT_ROUNDS);
  console.log(saltRounds);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};

export default hashPassword;