import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

import { ProgrammingLanguage } from '../project.schema';

export class QueryProjectDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(ProgrammingLanguage)
  language: ProgrammingLanguage;

  @IsOptional()
  @IsEnum(['true', 'false'])
  populate: 'true' | 'false';

  @IsOptional()
  @IsNumberString()
  page: string;

  @IsOptional()
  @IsNumberString()
  limit: string;
}
