import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Project } from 'src/project/project.schema';

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

SectionSchema.pre('deleteOne', { document: true }, async function () {
  if (this.sections && this.sections.length > 0) {
    const SectionModel = this.model(Section.name);
    const ProjectModel = this.model(Project.name);

    // Remove section references from the project
    await ProjectModel.updateMany(
      { sections: this._id },
      { $pull: { sections: this._id } },
    );

    for (const sectionId of this.sections as Types.ObjectId[]) {
      const subsection = await SectionModel.findById(sectionId);

      if (subsection) {
        await subsection.deleteOne();
      }
    }
  }
});
