import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SectionDocument = HydratedDocument<Section>;

@Schema({ timestamps: true })
export class Section {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Number, required: true })
  order: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Section.name }] })
  sections?: Types.ObjectId[] | SectionDocument[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);
