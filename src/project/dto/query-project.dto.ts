import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ProgrammingLanguage } from '../project.schema';

export enum QueryProjectBooleanString {
  TRUE = 'true',
  FALSE = 'false',
}

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
  @IsEnum(QueryProjectBooleanString)
  populate: QueryProjectBooleanString;
}
