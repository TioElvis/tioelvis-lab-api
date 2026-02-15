import { Types } from 'mongoose';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateSectionDto } from './create-section.dto';

export class UpdateSectionDto extends PartialType(
  OmitType(CreateSectionDto, ['projectId']),
) {}

export class UpdateSectionSectionsDto {
  @IsNotEmpty()
  @IsMongoId()
  sectionId: Types.ObjectId;
}
