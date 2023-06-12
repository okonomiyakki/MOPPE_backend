import { IsNotEmpty, IsOptional, IsString, IsArray, IsInt, IsEmail } from 'class-validator';

export class AddProjectDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'project_type이 입력되지 않았습니다.' })
  @IsString({ message: 'project_type이 문자열 형식이 아닙니다.' })
  public project_type: string;

  @IsNotEmpty({ message: 'project_title이 입력되지 않았습니다.' })
  @IsString({ message: 'project_title이 문자열 형식이 아닙니다.' })
  public project_title: string;

  @IsNotEmpty({ message: 'project_summary가 입력되지 않았습니다.' })
  @IsString({ message: 'project_summary가 문자열 형식이 아닙니다.' })
  public project_summary: string;

  @IsNotEmpty({ message: 'project_recruitment_roles가 입력되지 않았습니다.' })
  @IsArray({ message: 'project_recruitment_roles가 배열 형식이 아닙니다.' })
  public project_recruitment_roles: string[];

  @IsNotEmpty({ message: 'project_goal이 입력되지 않았습니다.' })
  @IsString({ message: 'project_goal이 문자열 형식이 아닙니다.' })
  public project_goal: string;

  @IsNotEmpty({ message: 'project_participation_time가 입력되지 않았습니다.' })
  @IsString({ message: 'project_participation_time가 문자열 형식이 아닙니다.' })
  public project_participation_time: string;

  @IsNotEmpty({ message: 'project_introduction이 입력되지 않았습니다.' })
  @IsString({ message: 'project_introduction이 문자열 형식이 아닙니다.' })
  public project_introduction: string;

  @IsOptional()
  @IsArray({ message: 'project_required_stacks가 배열 형식이 아닙니다.' })
  public project_required_stacks?: string[];

  @IsOptional()
  @IsArray({ message: 'fileList이 배열 형식이 아닙니다.' })
  public fileList?: string[];

  constructor(
    user_id: number,
    project_type: string,
    project_title: string,
    project_summary: string,
    project_recruitment_roles: string[],
    project_goal: string,
    project_participation_time: string,
    project_introduction: string,
    project_required_stacks?: string[],
    fileList?: string[]
  ) {
    this.user_id = user_id;
    this.project_type = project_type;
    this.project_title = project_title;
    this.project_summary = project_summary;
    this.project_recruitment_roles = project_recruitment_roles;
    this.project_goal = project_goal;
    this.project_participation_time = project_participation_time;
    this.project_introduction = project_introduction;
    this.project_required_stacks = project_required_stacks;
    this.fileList = fileList;
  }
}

export class EditProjectInfoDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'project_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'project_id가 정수 형식이 아닙니다.' })
  public project_id: number;

  @IsOptional()
  @IsString({ message: 'project_type이 문자열 형식이 아닙니다.' })
  public project_type?: string;

  @IsOptional()
  @IsString({ message: 'project_title이 문자열 형식이 아닙니다.' })
  public project_title?: string;

  @IsOptional()
  @IsString({ message: 'project_summary가 문자열 형식이 아닙니다.' })
  public project_summary?: string;

  @IsOptional()
  @IsArray({ message: 'project_recruitment_roles가 배열 형식이 아닙니다.' })
  public project_recruitment_roles?: string[];

  @IsOptional()
  @IsString({ message: 'project_goal이 문자열 형식이 아닙니다.' })
  public project_goal?: string;

  @IsOptional()
  @IsString({ message: 'project_participation_time가 문자열 형식이 아닙니다.' })
  public project_participation_time?: string;

  @IsOptional()
  @IsString({ message: 'project_introduction이 문자열 형식이 아닙니다.' })
  public project_introduction?: string;

  @IsOptional()
  @IsArray({ message: 'project_required_stacks가 배열 형식이 아닙니다.' })
  public project_required_stacks?: string[];

  @IsOptional()
  @IsArray({ message: 'fileList이 배열 형식이 아닙니다.' })
  public fileList?: string[];

  constructor(
    user_id: number,
    project_id: number,
    project_type?: string,
    project_title?: string,
    project_summary?: string,
    project_recruitment_roles?: string[],
    project_goal?: string,
    project_participation_time?: string,
    project_introduction?: string,
    project_required_stacks?: string[],
    fileList?: string[]
  ) {
    this.user_id = user_id;
    this.project_id = project_id;
    this.project_type = project_type;
    this.project_title = project_title;
    this.project_summary = project_summary;
    this.project_recruitment_roles = project_recruitment_roles;
    this.project_goal = project_goal;
    this.project_participation_time = project_participation_time;
    this.project_introduction = project_introduction;
    this.project_required_stacks = project_required_stacks;
    this.fileList = fileList;
  }
}

export class EditProjectStatusDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'project_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'project_id가 정수 형식이 아닙니다.' })
  public project_id: number;

  @IsNotEmpty({ message: 'project_recruitment_status이 입력되지 않았습니다.' })
  @IsString({ message: 'project_recruitment_status이 문자열 형식이 아닙니다.' })
  public project_recruitment_status: string;

  constructor(user_id: number, project_id: number, project_recruitment_status: string) {
    this.user_id = user_id;
    this.project_id = project_id;
    this.project_recruitment_status = project_recruitment_status;
  }
}

export class RemoveProjectDto {
  @IsNotEmpty({ message: 'user_id가 입력되지 않았습니다.' })
  @IsInt({ message: 'user_id가 정수 형식이 아닙니다.' })
  public user_id: number;

  @IsNotEmpty({ message: 'project_id가 입력되지 않았습니다. 다시 로그인해 주세요' })
  @IsInt({ message: 'project_id가 정수 형식이 아닙니다.' })
  public project_id: number;

  constructor(user_id: number, project_id: number) {
    this.user_id = user_id;
    this.project_id = project_id;
  }
}
