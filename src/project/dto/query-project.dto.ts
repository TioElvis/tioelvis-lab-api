import { IsEnum, IsOptional, IsString } from 'class-validator';

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
}
