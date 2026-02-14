import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, required: true, enum: ProgrammingLanguage })
  language: ProgrammingLanguage;

  @Prop({ type: String })
  repositoryUrl?: string;

  @Prop({ type: String })
  demoUrl?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
