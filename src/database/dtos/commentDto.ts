import { IsNotEmpty, IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class AddProjectCommentDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'project_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'project_id가 정수 형식이 아닙니다.' })
  public project_id: number;

  @IsNotEmpty({ message: 'comment_content가 입력되지 않았습니다.' })
  @IsString({ message: 'comment_content가 문자열 형식이 아닙니다.' })
  public comment_content: string;

  constructor(user_id: number, project_id: number, comment_content: string) {
    this.user_id = user_id;
    this.project_id = project_id;
    this.comment_content = comment_content;
  }
}

export class AddPortfolioCommentDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'portfolio_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'portfolio_id가 정수 형식이 아닙니다.' })
  public portfolio_id: number;

  @IsNotEmpty({ message: 'comment_content가 입력되지 않았습니다.' })
  @IsString({ message: 'comment_content가 문자열 형식이 아닙니다.' })
  public comment_content: string;

  constructor(user_id: number, portfolio_id: number, comment_content: string) {
    this.user_id = user_id;
    this.portfolio_id = portfolio_id;
    this.comment_content = comment_content;
  }
}

export class EditCommentDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'comment_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'comment_id가 정수 형식이 아닙니다.' })
  public comment_id: number;

  @IsNotEmpty({ message: 'comment_content가 입력되지 않았습니다.' })
  @IsString({ message: 'comment_content가 문자열 형식이 아닙니다.' })
  public comment_content: string;

  constructor(user_id: number, comment_id: number, comment_content: string) {
    this.user_id = user_id;
    this.comment_id = comment_id;
    this.comment_content = comment_content;
  }
}

export class RemoveCommentDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'comment_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'comment_id가 정수 형식이 아닙니다.' })
  public comment_id: number;

  constructor(user_id: number, comment_id: number) {
    this.user_id = user_id;
    this.comment_id = comment_id;
  }
}

export class GetMyCommentsByIdDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'page가 입력되지 않았습니다.' })
  @IsInt({ message: 'page가 정수 형식이 아닙니다.' })
  public page: number;

  constructor(user_id: number, page: number) {
    this.user_id = user_id;
    this.page = page;
  }
}
