import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Section, SectionDocument } from './section.schema';

import { QuerySectionDto } from './dto/query-section.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

import { QueryBooleanString } from 'src/global.dto';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  async create(body: CreateSectionDto) {
    const existingSection = await this.sectionModel.findOne({
      slug: body.slug,
    });

    if (existingSection) {
      throw new BadRequestException('Section with this slug already exists');
    }

    await this.projectService.findById(body.projectId);

    const payload: Section = {
      ...body,
    };

    try {
      const section = await this.sectionModel.create(payload);

      await this.projectService.addSection(body.projectId, section._id);

      return 'Section created successfully';
    } catch (error) {
      console.error('Error creating section:', error);
      throw new BadRequestException('Failed to create section');
    }
  }

  async find(query: QuerySectionDto) {
    const filter: Record<string, any> = {};

    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }

    if (query.slug) {
      filter.slug = query.slug;
    }

    try {
      if (query.populate === QueryBooleanString.TRUE) {
        return await this.sectionModel.find(filter).populate('sections').exec();
      }

      return await this.sectionModel.find(filter).exec();
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw new BadRequestException('Failed to fetch sections');
    }
  }

  async findById(id: Types.ObjectId) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid section id');
    }

    const section = await this.sectionModel.findById(id).exec();

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section;
  }

  async update(id: Types.ObjectId, body: UpdateSectionDto) {
    const section = await this.findById(id);

    if (body.slug && body.slug !== section.slug) {
      const existingSection = await this.sectionModel.findOne({
        slug: body.slug,
      });

      if (existingSection) {
        throw new BadRequestException('Section with this slug already exists');
      }
    }

    try {
      await section.updateOne({ $set: body }, { runValidators: true }).exec();

      return 'Section updated successfully';
    } catch (error) {
      console.error('Error updating section:', error);
      throw new BadRequestException('Failed to update section');
    }
  }

  async addSection(parentId: Types.ObjectId, childrenId: Types.ObjectId) {
    const parentSection = await this.findById(parentId);

    if (parentSection._id.equals(childrenId)) {
      throw new BadRequestException('Section cannot be a child of itself');
    }

    if (!Types.ObjectId.isValid(childrenId)) {
      throw new BadRequestException('Invalid section children id');
    }

    const childSection = await this.findById(childrenId);

    if (
      (parentSection.sections as Types.ObjectId[]).includes(childSection._id)
    ) {
      throw new BadRequestException(
        'Section children is already added to this section',
      );
    }

    try {
      await parentSection
        .updateOne(
          { $addToSet: { sections: childSection._id } },
          { runValidators: true },
        )
        .exec();

      return 'Section children added successfully';
    } catch (error) {
      console.error('Error adding section children:', error);
      throw new BadRequestException('Failed to add section children');
    }
  }

  async removeSection(parentId: Types.ObjectId, childrenId: Types.ObjectId) {
    const parentSection = await this.findById(parentId);

    if (!Types.ObjectId.isValid(childrenId)) {
      throw new BadRequestException('Invalid section children id');
    }

    const childSection = await this.findById(childrenId);

    if (
      !(parentSection.sections as Types.ObjectId[]).includes(childSection._id)
    ) {
      throw new BadRequestException(
        'Section children is not part of this section',
      );
    }

    try {
      await parentSection
        .updateOne({ $pull: { sections: childrenId } }, { runValidators: true })
        .exec();

      return 'Section children removed successfully';
    } catch (error) {
      console.error('Error removing section children:', error);
      throw new BadRequestException('Failed to remove section children');
    }
  }

  async deleteOne(id: Types.ObjectId) {
    const section = await this.findById(id);

    try {
      await section.deleteOne();

      return 'Section deleted successfully';
    } catch (error) {
      console.error('Error deleting section:', error);
      throw new BadRequestException('Failed to delete section');
    }
  }
}
