import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

import { ProjectService } from './project.service';

import {
  UpdateProjectDto,
  UpdateProjectSectionsDto,
} from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async create(@Body() body: CreateProjectDto) {
    return await this.projectService.create(body);
  }

  @Get('find')
  async find(@Query() query: QueryProjectDto) {
    return await this.projectService.find(query);
  }

  @Get('find-by-id/:id')
  async findById(@Param('id') id: Types.ObjectId) {
    return await this.projectService.findById(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() body: UpdateProjectDto,
  ) {
    return await this.projectService.update(id, body);
  }

  @Patch('add-section/:id')
  async addSection(
    @Param('id') projectId: Types.ObjectId,
    @Body() { sectionId }: UpdateProjectSectionsDto,
  ) {
    return await this.projectService.addSection(projectId, sectionId);
  }

  @Patch('remove-section/:id')
  async removeSection(
    @Param('id') projectId: Types.ObjectId,
    @Body() { sectionId }: UpdateProjectSectionsDto,
  ) {
    return await this.projectService.removeSection(projectId, sectionId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: Types.ObjectId) {
    return await this.projectService.delete(id);
  }
}
