import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: '이름이 입력되지 않았습니다.' })
  @IsString({ message: '이름이 문자열 형식이 아닙니다.' })
  public user_name: string;

  @IsNotEmpty({ message: '이메일이 입력되지 않았습니다.' })
  @IsString({ message: '이메일이 문자열 형식이 아닙니다.' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  public user_email: string;

  @IsNotEmpty({ message: '비밀번호가 입력되지 않았습니다.' })
  @IsString({ message: '비밀번호가 문자열 형식이 아닙니다.' })
  public user_password: string;

  constructor(user_name: string, user_email: string, user_password: string) {
    this.user_name = user_name;
    this.user_email = user_email;
    this.user_password = user_password;
  }
}

export class LogInDto {
  @IsNotEmpty({ message: '이메일이 입력되지 않았습니다.' })
  @IsString({ message: '이메일이 문자열 형식이 아닙니다.' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  public user_email: string;

  @IsNotEmpty({ message: '비밀번호가 입력되지 않았습니다.' })
  @IsString({ message: '비밀번호가 문자열 형식이 아닙니다.' })
  public user_password: string;

  constructor(user_email: string, user_password: string) {
    this.user_email = user_email;
    this.user_password = user_password;
  }
}
