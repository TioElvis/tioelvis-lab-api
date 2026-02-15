import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QuerySectionDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(['true', 'false'])
  populate: 'true' | 'false';
}
