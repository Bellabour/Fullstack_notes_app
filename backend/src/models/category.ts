import { Schema, model,InferSchemaType} from 'mongoose';

const categorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String },
  // Other category-related fields if needed
});

type Category = InferSchemaType<typeof categorySchema>;

export default model<Category>('Category', categorySchema);
