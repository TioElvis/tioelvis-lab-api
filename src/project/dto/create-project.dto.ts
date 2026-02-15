import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

import { ProgrammingLanguage } from '../project.schema';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase, alphanumeric, and can contain hyphens',
  })
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ProgrammingLanguage)
  language: ProgrammingLanguage;

  @IsOptional()
  @IsUrl({}, { message: 'Repository URL must be a valid URL' })
  repositoryUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Demo URL must be a valid URL' })
  demoUrl?: string;
}
