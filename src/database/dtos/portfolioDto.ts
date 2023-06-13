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

  constructor(
    user_id: number,
    portfolio_title: string,
    portfolio_summary: string,
    portfolio_github: string,
    portfolio_stacks: string[],
    portfolio_description: string,
    memberIds: number[],
    fileList: string[]
  ) {
    this.user_id = user_id;
    this.portfolio_title = portfolio_title;
    this.portfolio_summary = portfolio_summary;
    this.portfolio_github = portfolio_github;
    this.portfolio_stacks = portfolio_stacks;
    this.portfolio_description = portfolio_description;
    this.memberIds = memberIds;
    this.fileList = fileList;
  }
}
