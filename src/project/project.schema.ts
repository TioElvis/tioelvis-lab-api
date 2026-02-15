import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Section } from 'src/section/section.schema';

export type ProjectDocument = HydratedDocument<Project>;

export enum ProgrammingLanguage {
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
  C = 'C',
  Go = 'Go',
  CPP = 'C++',
  Rust = 'Rust',
  Java = 'Java',
  Python = 'Python',
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true, enum: ProgrammingLanguage })
  language: ProgrammingLanguage;

  @Prop({ type: String })
  repositoryUrl?: string;

  @Prop({ type: String })
  demoUrl?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Section.name }] })
  sections?: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.pre('deleteOne', { document: true }, async function () {
  if (this.sections && this.sections.length > 0) {
    const SectionModel = this.model(Section.name);

    for (const sectionId of this.sections) {
      const section = await SectionModel.findById(sectionId);

      if (section) {
        await section.deleteOne();
      }
    }
  }
});
