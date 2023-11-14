import { Schema, model, InferSchemaType } from 'mongoose';

const folderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String },
  // Other folder-related fields if needed
});

type Folder = InferSchemaType<typeof folderSchema>;

export default model<Folder>('Folder', folderSchema);
