import { Types } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty } from 'class-validator';

import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class UpdateProjectSectionsDto {
  @IsNotEmpty()
  @IsMongoId()
  sectionId: Types.ObjectId;
}
