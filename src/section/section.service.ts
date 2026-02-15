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

import { ProjectService } from 'src/project/project.service';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  async create(body: CreateSectionDto) {
    if (body.projectId && body.parentId) {
      throw new BadRequestException(
        'A section cannot have both projectId and parentId',
      );
    }

    if (!body.projectId && !body.parentId) {
      throw new BadRequestException(
        'Either projectId or parentId must be provided',
      );
    }

    const existingSection = await this.sectionModel.findOne({
      slug: body.slug,
    });

    if (existingSection) {
      throw new BadRequestException('Section with this slug already exists');
    }

    if (body.projectId) {
      await this.projectService.findById(body.projectId);
    }

    if (body.parentId) {
      await this.findById(body.parentId);
    }

    const payload: Section = {
      ...body,
    };

    try {
      const section = await this.sectionModel.create(payload);

      if (body.projectId) {
        await this.projectService.addSection(body.projectId, section._id);
      }

      if (body.parentId) {
        await this.addSection(body.parentId, section._id);
      }

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
      if (query.populate === 'true') {
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
        _id: { $ne: id },
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
    const parent = await this.findById(parentId);

    if (parent._id.equals(childrenId)) {
      throw new BadRequestException('Section cannot be a child of itself');
    }

    if (!Types.ObjectId.isValid(childrenId)) {
      throw new BadRequestException('Invalid section children id');
    }

    const child = await this.findById(childrenId);

    if ((parent.sections as Types.ObjectId[]).includes(child._id)) {
      throw new BadRequestException(
        'Section children is already added to this section',
      );
    }

    try {
      await parent
        .updateOne(
          { $addToSet: { sections: child._id } },
          { runValidators: true },
        )
        .exec();

      return 'Section children added successfully';
    } catch (error) {
      console.error('Error adding section children:', error);
      throw new BadRequestException('Failed to add section children');
    }
  }

  async delete(id: Types.ObjectId) {
    const section = await this.findById(id);

    try {
      await section.deleteOne();

      return 'Section and sub-sections deleted successfully';
    } catch (error) {
      console.error('Error deleting section:', error);
      throw new BadRequestException('Failed to delete section');
    }
  }
}
