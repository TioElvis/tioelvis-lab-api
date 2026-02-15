import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateSectionDto } from './create-section.dto';

export class UpdateSectionDto extends PartialType(
  OmitType(CreateSectionDto, ['projectId', 'parentId'] as const),
) {}
