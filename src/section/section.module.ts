import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Section, SectionSchema } from './section.schema';

import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: SectionSchema }]),
    forwardRef(() => ProjectModule),
  ],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
