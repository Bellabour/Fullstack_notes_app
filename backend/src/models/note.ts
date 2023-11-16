import { InferSchemaType, model, Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const noteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  text: { type: String },
  folders: [{ type: Schema.Types.ObjectId, ref: 'Folder',autopopulate: true }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag',autopopulate: true}],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category', autopopulate: true }],
}, { timestamps: true });
noteSchema.plugin(autopopulate);

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>('Note', noteSchema);
