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

import { QuerySectionDto } from './dto/query-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
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

  @Delete('delete/:id')
  async delete(@Param('id') id: Types.ObjectId) {
    return await this.sectionService.delete(id);
  }
}
