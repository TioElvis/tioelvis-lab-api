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

import { SectionService } from './section.service';

import {
  UpdateSectionDto,
  UpdateSectionSectionsDto,
} from './dto/update-section.dto';
import { QuerySectionDto } from './dto/query-section.dto';
import { CreateSectionDto } from './dto/create-section.dto';

@Controller('section')
@UseGuards(AuthGuard('jwt'))
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post('create')
  async create(@Body() body: CreateSectionDto) {
    return await this.sectionService.create(body);
  }

  @Get('find')
  async find(@Query() query: QuerySectionDto) {
    return await this.sectionService.find(query);
  }

  @Get('find-by-id/:id')
  async findById(@Param('id') id: Types.ObjectId) {
    return await this.sectionService.findById(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() body: UpdateSectionDto,
  ) {
    return await this.sectionService.update(id, body);
  }

  @Patch('add-section/:id')
  async addSection(
    @Param('id') id: Types.ObjectId,
    @Body() { sectionId }: UpdateSectionSectionsDto,
  ) {
    return await this.sectionService.addSection(id, sectionId);
  }

  @Patch('remove-section/:id')
  async removeSection(
    @Param('id') id: Types.ObjectId,
    @Body() { sectionId }: UpdateSectionSectionsDto,
  ) {
    return await this.sectionService.removeSection(id, sectionId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: Types.ObjectId) {
    return await this.sectionService.deleteOne(id);
  }
}
