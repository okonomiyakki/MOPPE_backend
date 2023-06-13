import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class AddProjectBookmarkDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'project_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'project_id가 정수 형식이 아닙니다.' })
  public project_id: number;

  constructor(user_id: number, project_id: number) {
    this.user_id = user_id;
    this.project_id = project_id;
  }
}

export class AddPortfolioBookmarkDto {
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

export class RemoveProjectBookmarkDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'project_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'project_id가 정수 형식이 아닙니다.' })
  public project_id: number;

  constructor(user_id: number, project_id: number) {
    this.user_id = user_id;
    this.project_id = project_id;
  }
}

export class RemovePortfolioBookmarkDto {
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
