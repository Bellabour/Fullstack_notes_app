import { InferSchemaType, model, Schema } from 'mongoose';

const noteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  text: { type: String },
  folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, { timestamps: true });

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>('Note', noteSchema);
