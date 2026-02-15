import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ProgrammingLanguage } from '../project.schema';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ProgrammingLanguage)
  language: ProgrammingLanguage;

  @IsOptional()
  @IsString()
  repositoryUrl: string;

  @IsOptional()
  @IsString()
  demoUrl: string;
}
