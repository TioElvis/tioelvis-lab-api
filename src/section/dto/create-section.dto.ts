import { Types } from 'mongoose';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  order: number;

  @IsNotEmpty()
  @IsMongoId()
  projectId: Types.ObjectId;
}
