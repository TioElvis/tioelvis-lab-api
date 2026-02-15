import { IsEnum, IsOptional, IsString } from 'class-validator';

import { QueryBooleanString } from 'src/query-boolean-string.dto';

export class QuerySectionDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(QueryBooleanString)
  populate: QueryBooleanString;
}
