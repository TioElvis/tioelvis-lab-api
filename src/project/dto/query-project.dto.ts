import { IsEnum, IsOptional, IsString } from 'class-validator';

import { QueryBooleanString } from 'src/query-boolean-string.dto';

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
  @IsEnum(QueryBooleanString)
  populate: QueryBooleanString;
}
