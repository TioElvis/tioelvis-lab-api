import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Project, ProjectDocument } from './project.schema';

import { QueryProjectDto } from './dto/query-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { QueryBooleanString } from 'src/global.dto';
import { SectionService } from 'src/section/section.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @Inject(forwardRef(() => SectionService))
    private sectionService: SectionService,
  ) {}

  async create(body: CreateProjectDto) {
    const existingProject = await this.projectModel
      .findOne({ slug: body.slug })
      .exec();

    if (existingProject) {
      throw new BadRequestException('Project with this slug already exists');
    }

    const payload: Project = {
      ...body,
    };

    try {
      await this.projectModel.create(payload);

      return 'Project created successfully';
    } catch (error) {
      console.error('Error creating project:', error);
      throw new BadRequestException('Failed to create project');
    }
  }

  async find(query: QueryProjectDto) {
    const filter: Record<string, any> = {};

    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }

    if (query.slug) {
      filter.slug = query.slug;
    }

    if (query.language) {
      filter.language = query.language;
    }

    try {
      if (query.populate === QueryBooleanString.TRUE) {
        return await this.projectModel.find(filter).populate('sections').exec();
      }

      return await this.projectModel.find(filter).exec();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new BadRequestException('Failed to fetch projects');
    }
  }

  async findById(id: Types.ObjectId) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid project id');
    }

    const project = await this.projectModel.findById(id).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: Types.ObjectId, body: UpdateProjectDto) {
    const project = await this.findById(id);

    if (body.slug && body.slug !== project.slug) {
      const existingProject = await this.projectModel
        .findOne({ slug: body.slug, _id: { $ne: id } })
        .exec();

      if (existingProject) {
        throw new BadRequestException('Project with this slug already exists');
      }
    }

    try {
      await project.updateOne({ $set: body }, { runValidators: true });

      return 'Project updated successfully';
    } catch (error) {
      console.error('Error updating project:', error);
      throw new BadRequestException('Failed to update project');
    }
  }

  async addSection(projectId: Types.ObjectId, sectionId: Types.ObjectId) {
    const project = await this.findById(projectId);

    if (!Types.ObjectId.isValid(sectionId)) {
      throw new BadRequestException('Invalid section id');
    }

    if ((project.sections as Types.ObjectId[]).includes(sectionId)) {
      throw new BadRequestException('Section is already added to this project');
    }

    const section = await this.sectionService.findById(sectionId);

    try {
      await project.updateOne(
        { $addToSet: { sections: section._id } },
        { runValidators: true },
      );

      return 'Section added successfully';
    } catch (error) {
      console.error('Error adding section:', error);
      throw new BadRequestException('Failed to add section');
    }
  }

  async removeSection(projectId: Types.ObjectId, sectionId: Types.ObjectId) {
    const project = await this.findById(projectId);

    if (!Types.ObjectId.isValid(sectionId)) {
      throw new BadRequestException('Invalid section id');
    }

    if (!(project.sections as Types.ObjectId[]).includes(sectionId)) {
      throw new BadRequestException('Section is not included to this project');
    }

    const section = await this.sectionService.findById(sectionId);

    try {
      await project.updateOne(
        { $pull: { sections: section._id } },
        { runValidators: true },
      );

      return 'Section removed successfully';
    } catch (error) {
      console.error('Error removing section:', error);
      throw new BadRequestException('Failed to remove section');
    }
  }

  async delete(id: Types.ObjectId) {
    const project = await this.findById(id);

    // TODO: Delete all sections of the project

    try {
      await project.deleteOne();

      return 'Project deleted successfully';
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new BadRequestException('Failed to delete project');
    }
  }
}
