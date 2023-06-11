import { IsNotEmpty, IsOptional, IsString, IsArray, IsInt, IsEmail } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'name이 입력되지 않았습니다.' })
  @IsString({ message: 'name이 문자열 형식이 아닙니다.' })
  public user_name: string;

  @IsNotEmpty({ message: 'email이 입력되지 않았습니다.' })
  @IsString({ message: 'email이 문자열 형식이 아닙니다.' })
  @IsEmail({}, { message: '올바른 email 형식이 아닙니다.' })
  public user_email: string;

  @IsNotEmpty({ message: 'password가 입력되지 않았습니다.' })
  @IsString({ message: 'password가 문자열 형식이 아닙니다.' })
  public user_password: string;

  constructor(user_name: string, user_email: string, user_password: string) {
    this.user_name = user_name;
    this.user_email = user_email;
    this.user_password = user_password;
  }
}

export class LogInDto {
  @IsNotEmpty({ message: 'email이 입력되지 않았습니다.' })
  @IsString({ message: 'email이 문자열 형식이 아닙니다.' })
  @IsEmail({}, { message: '올바른 email 형식이 아닙니다.' })
  public user_email: string;

  @IsNotEmpty({ message: 'password가 입력되지 않았습니다.' })
  @IsString({ message: 'password가 문자열 형식이 아닙니다.' })
  public user_password: string;

  constructor(user_email: string, user_password: string) {
    this.user_email = user_email;
    this.user_password = user_password;
  }
}

export class EditInfoDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsOptional()
  @IsString({ message: 'name이 문자열 형식이 아닙니다.' })
  public user_name?: string;

  @IsOptional()
  @IsString({ message: 'career_goal이 문자열 형식이 아닙니다.' })
  public user_career_goal?: string;

  @IsOptional()
  @IsArray({ message: 'stacks가 배열 형식이 아닙니다.' })
  public user_stacks?: string[];

  @IsOptional()
  @IsString({ message: 'introduction이 문자열 형식이 아닙니다.' })
  public user_introduction?: string;

  @IsOptional()
  @IsString({ message: 'filename이 문자열 형식이 아닙니다.' })
  public filename?: string;

  constructor(
    user_id: number,
    user_name?: string,
    user_career_goal?: string,
    user_stacks?: string[],
    user_introduction?: string,
    filename?: string
  ) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.user_career_goal = user_career_goal;
    this.user_stacks = user_stacks;
    this.user_introduction = user_introduction;
    this.filename = filename;
  }
}

export class GetMemberInfoDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  constructor(user_id: number) {
    this.user_id = user_id;
  }
}

export class GetMyInfoDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  constructor(user_id: number) {
    this.user_id = user_id;
  }
}

export class GetMembersDto {
  @IsOptional()
  @IsString({ message: 'keyword가 문자열 형식이 아닙니다.' })
  public keyword: string;

  constructor(keyword: string) {
    this.keyword = keyword;
  }
}
