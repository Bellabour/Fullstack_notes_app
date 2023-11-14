import { Schema, model ,InferSchemaType } from 'mongoose';

const tagSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String },
  // Other tag-related fields if needed
});

type Tag = InferSchemaType<typeof tagSchema>;

export default model<Tag>('Tag', tagSchema);
