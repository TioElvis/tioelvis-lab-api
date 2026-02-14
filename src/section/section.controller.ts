import { AuthGuard } from '@nestjs/passport';
import { Controller, UseGuards } from '@nestjs/common';

import { SectionService } from './section.service';

@Controller('section')
@UseGuards(AuthGuard('jwt'))
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}
}
