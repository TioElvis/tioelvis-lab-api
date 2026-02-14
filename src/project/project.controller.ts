import { AuthGuard } from '@nestjs/passport';
import { Controller, UseGuards } from '@nestjs/common';

import { ProjectService } from './project.service';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
}
