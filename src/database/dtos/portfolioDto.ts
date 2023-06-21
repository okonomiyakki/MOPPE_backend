import { IsNotEmpty, IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class AddPortfolioDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'portfolio_title이 입력되지 않았습니다.' })
  @IsString({ message: 'portfolio_title이 문자열 형식이 아닙니다.' })
  public portfolio_title: string;

  @IsNotEmpty({ message: 'portfolio_summary가 입력되지 않았습니다.' })
  @IsString({ message: 'portfolio_summary가 문자열 형식이 아닙니다.' })
  public portfolio_summary: string;

  @IsNotEmpty({ message: 'portfolio_github가 입력되지 않았습니다.' })
  @IsString({ message: 'portfolio_github가 문자열 형식이 아닙니다.' })
  public portfolio_github: string;

  @IsNotEmpty({ message: 'portfolio_stacks가 입력되지 않았습니다.' })
  @IsArray({ message: 'portfolio_stacks가 배열 형식이 아닙니다.' })
  public portfolio_stacks: string[];

  @IsNotEmpty({ message: 'portfolio_description이 입력되지 않았습니다.' })
  @IsString({ message: 'portfolio_description이 문자열 형식이 아닙니다.' })
  public portfolio_description: string;

  @IsNotEmpty({ message: 'memberIds가 입력되지 않았습니다.' })
  @IsArray({ message: 'memberIds가 배열 형식이 아닙니다.' })
  public memberIds: number[];

  @IsNotEmpty({ message: 'fileList가 입력되지 않았습니다.' })
  @IsArray({ message: 'fileList가 배열 형식이 아닙니다.' })
  public fileList: string[];

  @IsNotEmpty({ message: 'project_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'project_id가 정수 형식이 아닙니다.' })
  public project_id: number;

  constructor(
    user_id: number,
    project_id: number,
    portfolio_title: string,
    portfolio_summary: string,
    portfolio_github: string,
    portfolio_stacks: string[],
    portfolio_description: string,
    memberIds: number[],
    fileList: string[]
  ) {
    this.user_id = user_id;
    this.project_id = project_id;
    this.portfolio_title = portfolio_title;
    this.portfolio_summary = portfolio_summary;
    this.portfolio_github = portfolio_github;
    this.portfolio_stacks = portfolio_stacks;
    this.portfolio_description = portfolio_description;
    this.memberIds = memberIds;
    this.fileList = fileList;
  }
}

export class EditPortfolioDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'portfolio_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'portfolio_id가 정수 형식이 아닙니다.' })
  public portfolio_id: number;

  @IsNotEmpty({ message: 'project_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'project_id가 정수 형식이 아닙니다.' })
  public project_id: number;

  @IsNotEmpty({ message: 'portfolio_stacks가 입력되지 않았습니다.' })
  @IsArray({ message: 'portfolio_stacks가 배열 형식이 아닙니다.' })
  public portfolio_stacks: string[];

  @IsNotEmpty({ message: 'memberIds가 입력되지 않았습니다.' })
  @IsArray({ message: 'memberIds가 배열 형식이 아닙니다.' })
  public memberIds: number[];

  @IsOptional()
  @IsString({ message: 'portfolio_title이 문자열 형식이 아닙니다.' })
  public portfolio_title?: string;

  @IsOptional()
  @IsString({ message: 'portfolio_summary가 문자열 형식이 아닙니다.' })
  public portfolio_summary?: string;

  @IsOptional()
  @IsString({ message: 'portfolio_github가 문자열 형식이 아닙니다.' })
  public portfolio_github?: string;

  @IsOptional()
  @IsString({ message: 'portfolio_description이 문자열 형식이 아닙니다.' })
  public portfolio_description?: string;

  @IsOptional()
  @IsArray({ message: 'fileList가 배열 형식이 아닙니다.' })
  public fileList?: string[];

  constructor(
    user_id: number,
    portfolio_id: number,
    project_id: number,
    portfolio_stacks: string[],
    memberIds: number[],
    portfolio_title?: string,
    portfolio_summary?: string,
    portfolio_github?: string,
    portfolio_description?: string,
    fileList?: string[]
  ) {
    this.user_id = user_id;
    this.portfolio_id = portfolio_id;
    this.project_id = project_id;
    this.portfolio_stacks = portfolio_stacks;
    this.memberIds = memberIds;
    this.portfolio_title = portfolio_title;
    this.portfolio_summary = portfolio_summary;
    this.portfolio_github = portfolio_github;
    this.portfolio_description = portfolio_description;
    this.fileList = fileList;
  }
}

export class RemovePortfolioDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'portfolio_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'portfolio_id가 정수 형식이 아닙니다.' })
  public portfolio_id: number;

  constructor(user_id: number, portfolio_id: number) {
    this.user_id = user_id;
    this.portfolio_id = portfolio_id;
  }
}

export class GetAllPortfoliosDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'keyword가 입력되지 않았습니다.' })
  @IsString({ message: 'keyword가 문자열 형식이 아닙니다.' })
  public keyword: string;

  @IsNotEmpty({ message: 'sort가 입력되지 않았습니다.' })
  @IsString({ message: 'sort가 문자열 형식이 아닙니다.' })
  public sort: string;

  @IsNotEmpty({ message: 'page가 입력되지 않았습니다.' })
  @IsInt({ message: 'page가 정수 형식이 아닙니다.' })
  public page: number;

  constructor(user_id: number, keyword: string, sort: string, page: number) {
    this.user_id = user_id;
    this.keyword = keyword;
    this.sort = sort;
    this.page = page;
  }
}

export class GetPortfolioByIdDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'portfolio_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'portfolio_id가 정수 형식이 아닙니다.' })
  public portfolio_id: number;

  constructor(user_id: number, portfolio_id: number) {
    this.user_id = user_id;
    this.portfolio_id = portfolio_id;
  }
}

export class GetUserPortfoliosByIdDto {
  @IsNotEmpty({ message: 'my_user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'my_user_id가 정수 형식이 아닙니다.' })
  public my_user_id: number;

  @IsNotEmpty({ message: 'page가 입력되지 않았습니다.' })
  @IsInt({ message: 'page가 정수 형식이 아닙니다.' })
  public page: number;

  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  constructor(my_user_id: number, page: number, user_id: number) {
    this.my_user_id = my_user_id;
    this.page = page;
    this.user_id = user_id;
  }
}

export class GetMyPortfoliosDto {
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

export class GetMyPortfolioCommentsByIdDto {
  @IsNotEmpty({ message: 'portfolio_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'portfolio_id가 정수 형식이 아닙니다.' })
  public portfolio_id: number;

  @IsNotEmpty({ message: 'page가 입력되지 않았습니다.' })
  @IsInt({ message: 'page가 정수 형식이 아닙니다.' })
  public page: number;

  constructor(portfolio_id: number, page: number) {
    this.portfolio_id = portfolio_id;
    this.page = page;
  }
}
