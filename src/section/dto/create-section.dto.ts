import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  order: number;

  @IsOptional()
  @IsMongoId()
  projectId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  parentId?: Types.ObjectId;
}
