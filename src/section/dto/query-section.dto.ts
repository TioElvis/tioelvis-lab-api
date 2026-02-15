import { IsEnum, IsOptional, IsString } from 'class-validator';

import { QueryBooleanString } from 'src/global.dto';

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
