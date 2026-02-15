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
  sections?: Types.ObjectId[] | Section[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
